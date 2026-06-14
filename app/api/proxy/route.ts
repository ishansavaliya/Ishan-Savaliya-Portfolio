import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Best-effort browsing proxy. Fetches an external page server-side and strips
 * frame-blocking headers so it can render inside the in-OS browser iframe.
 *
 * Honest limitations: many large sites (Google, LinkedIn, YouTube, anything
 * with login or heavy client JS / CSP) will still break or refuse. This works
 * best for simple, static, public pages.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(target);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  // Block internal / private hosts (SSRF guard).
  const host = url.hostname;
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    /^(10|192\.168|169\.254)\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return NextResponse.json({ error: "Blocked host" }, { status: 403 });
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });

    const contentType = res.headers.get("content-type") || "";

    // Non-HTML (images, etc.) — stream through as-is.
    if (!contentType.includes("text/html")) {
      const buf = await res.arrayBuffer();
      return new Response(buf, {
        headers: {
          "Content-Type": contentType || "application/octet-stream",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    let html = await res.text();

    // Strip scripts + meta-refresh so client-side JS can't trigger redirect
    // loops (the cause of the infinite-proxy bug on sites like Google). This
    // renders a clean, readable static snapshot.
    html = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<script\b[^>]*\/>/gi, "")
      .replace(/<meta[^>]*http-equiv=["']?refresh["']?[^>]*>/gi, "");

    const origin = `${url.protocol}//${url.host}`;
    // Our app's own origin (where /api/proxy lives) — so rewritten links stay
    // in-window regardless of the proxied page's <base>.
    const appOrigin = new URL(req.url).origin;

    // Rewrite <a href> links to route back through this proxy so clicking a
    // result keeps browsing IN-WINDOW (no outside redirect).
    html = html.replace(
      /<a\b([^>]*?)\shref=["']([^"'#][^"']*)["']/gi,
      (m, attrs, href) => {
        let abs: string;
        try {
          abs = new URL(href, origin + url.pathname).toString();
        } catch {
          return m;
        }
        if (!/^https?:/i.test(abs)) return m;
        const cleanedAttrs = attrs.replace(/\starget=["'][^"']*["']/gi, "");
        return `<a${cleanedAttrs} href="${appOrigin}/api/proxy?url=${encodeURIComponent(abs)}"`;
      }
    );

    // <base> so relative CSS/images resolve to the proxied origin (loaded
    // directly). Links were already rewritten to absolute app URLs above.
    const inject = `<base href="${origin}/">`;
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>${inject}`);
    } else {
      html = inject + html;
    }

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(
      `<html><body style="font-family:sans-serif;background:#1c1e26;color:#c2c8d4;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center">
        <div><h2>Couldn't load this page in-window</h2>
        <p>This site blocks embedding or timed out.<br/>
        <a style="color:#5aa9ff" href="${url.toString()}" target="_blank" rel="noreferrer">Open it in a new tab →</a></p></div>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }
}
