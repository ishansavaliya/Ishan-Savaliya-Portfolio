import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSmtp, sendBlogSubmissionEmails } from "@/lib/email";

const schema = z.object({
  authorName: z.string().min(2).max(80),
  authorEmail: z.string().email(),
  authorUrl: z.string().url().max(300),
  title: z.string().min(4).max(160),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  body: z.string().min(50).max(20000),
  tags: z.string().max(200).optional().or(z.literal("")),
  coverImage: z.string().url().max(500).optional().or(z.literal("")),
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
      cover_image: d.coverImage || null,
      author_name: d.authorName,
      author_url: d.authorUrl,
      reading_time: Math.max(1, Math.round(d.body.split(/\s+/).length / 200)),
      published: false,
    });
    stored = !error;
  }

  // Email Ishan (review) + confirmation to the author — branded templates.
  try {
    await sendBlogSubmissionEmails({
      authorName: d.authorName,
      authorEmail: d.authorEmail,
      authorUrl: d.authorUrl,
      title: d.title,
      tags: tags.length ? tags : ["Community"],
      body: d.body,
    });
  } catch {
    /* email best-effort */
  }

  if (!stored && !hasSmtp()) {
    return NextResponse.json(
      { error: "Could not submit right now. Please try later." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
