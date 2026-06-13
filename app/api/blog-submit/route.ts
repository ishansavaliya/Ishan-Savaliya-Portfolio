import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSmtp } from "@/lib/email";

const schema = z.object({
  authorName: z.string().min(2).max(80),
  authorEmail: z.string().email(),
  title: z.string().min(4).max(160),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  body: z.string().min(50).max(20000),
  tags: z.string().max(200).optional().or(z.literal("")),
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }
  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true }); // honeypot

  const tags = (d.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const slug = `${slugify(d.title)}-${Date.now().toString(36)}`;

  // Save as an UNPUBLISHED draft for review.
  const admin = createAdminClient();
  let stored = false;
  if (admin) {
    const { error } = await admin.from("blogs").insert({
      slug,
      title: d.title,
      excerpt: d.excerpt || d.body.slice(0, 160),
      body: `> Submitted by ${d.authorName} (${d.authorEmail}) — pending review.\n\n${d.body}`,
      tags: tags.length ? tags : ["Community"],
      reading_time: Math.max(1, Math.round(d.body.split(/\s+/).length / 200)),
      published: false,
    });
    stored = !error;
  }

  // Email Ishan (review) + confirmation to the author.
  if (hasSmtp()) {
    const t = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    const to = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER!;
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    try {
      await t.sendMail({
        from: `"Ishan OS" <${process.env.GMAIL_USER}>`,
        to,
        replyTo: d.authorEmail,
        subject: `📝 Blog submission for review: ${d.title}`,
        html: `<div style="font-family:sans-serif;max-width:600px">
          <h2>New blog submission (pending review)</h2>
          <p><b>Author:</b> ${esc(d.authorName)} &lt;${esc(d.authorEmail)}&gt;</p>
          <p><b>Title:</b> ${esc(d.title)}</p>
          <p><b>Tags:</b> ${esc(tags.join(", ") || "Community")}</p>
          <hr/>
          <pre style="white-space:pre-wrap;font-family:inherit">${esc(d.body)}</pre>
          <hr/>
          <p>Approve &amp; publish it in your control portal → Blog posts.</p>
        </div>`,
      });
      await t.sendMail({
        from: `"Ishan Savaliya" <${process.env.GMAIL_USER}>`,
        to: d.authorEmail,
        subject: "Thanks for your blog submission 📝",
        html: `<div style="font-family:sans-serif;max-width:600px">
          <h2>Thanks, ${esc(d.authorName.split(" ")[0])}!</h2>
          <p>Your post <b>"${esc(d.title)}"</b> was received and is pending review.
          If approved, it'll appear on ishansavaliya.me/blog. I'll be in touch.</p>
          <p>— Ishan Savaliya</p>
        </div>`,
      });
    } catch {
      /* email best-effort */
    }
  }

  if (!stored && !hasSmtp()) {
    return NextResponse.json(
      { error: "Could not submit right now. Please try later." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
