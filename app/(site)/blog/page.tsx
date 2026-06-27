import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getAllPosts } from "@/lib/content/blog";
import { JsonLd, breadcrumbJsonLd, blogJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog — Ishan Savaliya | AI, Next.js & Full-Stack Engineering",
  description:
    "Articles on AI agents, the Model Context Protocol (MCP), Next.js, React Server Components and modern full-stack engineering by Ishan Savaliya.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Blog — Ishan Savaliya",
    description:
      "Writing on AI, agents, MCP, Next.js and modern full-stack engineering.",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Ishan Savaliya",
    description:
      "Writing on AI, agents, MCP, Next.js and modern full-stack engineering.",
  },
};

// Revalidate so new posts published in the admin appear without a redeploy.
export const revalidate = 60;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogIndex() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      {posts.length > 0 && <JsonLd data={blogJsonLd(posts)} />}

      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          The Journal
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Blog
        </h1>
        <p className="mt-3 text-os-muted">
          Writing on AI, agents, MCP, Next.js and modern full-stack engineering.
        </p>
      </header>

      {!featured && (
        <p className="mt-10 text-os-muted">No posts yet — check back soon.</p>
      )}

      {/* ---------- featured post ---------- */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-10 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition hover:border-white/20 md:grid-cols-2"
        >
          <div
            className="relative min-h-56 overflow-hidden md:min-h-full"
            style={{ background: featured.coverGradient }}
          >
            {featured.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.coverImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            )}
            <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
              Featured
            </span>
          </div>
          <div className="flex flex-col justify-center p-7 md:p-9">
            <div className="flex items-center gap-2 text-xs text-os-muted">
              <span className="text-accent">{featured.category}</span>
              <span>·</span>
              <time dateTime={featured.publishedAt}>{fmtDate(featured.publishedAt)}</time>
              <span>·</span>
              <span>{featured.readingTime} min read</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight group-hover:text-accent md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-os-fg/75">{featured.excerpt}</p>
            <div className="mt-5 flex items-center gap-3 text-sm text-os-muted">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                  {(featured.authorName ?? "Ishan Savaliya").charAt(0)}
                </span>
                {featured.authorName ?? "Ishan Savaliya"}
              </span>
              <span className="flex items-center gap-1 text-accent-pink">
                <Heart size={13} className="fill-current" /> {featured.likes ?? 0}
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* ---------- grid of the rest ---------- */}
      {rest.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/20"
            >
              <div
                className="relative h-44 overflow-hidden"
                style={{ background: p.coverGradient }}
              >
                {p.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.coverImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-os-muted">
                  <span className="text-accent">{p.category}</span>
                  <span>·</span>
                  <time dateTime={p.publishedAt}>{fmtDate(p.publishedAt)}</time>
                  <span>·</span>
                  <span>{p.readingTime} min</span>
                </div>
                <h2 className="mt-1.5 font-display text-lg font-semibold leading-snug group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-os-fg/70">
                  {p.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-os-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10px] font-semibold text-accent">
                      {(p.authorName ?? "Ishan Savaliya").charAt(0)}
                    </span>
                    {p.authorName ?? "Ishan Savaliya"}
                  </span>
                  <span className="flex items-center gap-1 text-accent-pink">
                    <Heart size={12} className="fill-current" /> {p.likes ?? 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
