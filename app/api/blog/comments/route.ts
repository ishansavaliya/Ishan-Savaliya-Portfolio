import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/** List comments for a post (newest first). */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ comments: [] });

  const { data } = await admin
    .from("comments")
    .select("id,name,body,created_at")
    .eq("post_slug", slug)
    .order("created_at", { ascending: false });

  return NextResponse.json({ comments: data ?? [] });
}

const schema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().trim().min(1).max(60),
  body: z.string().trim().min(1).max(2000),
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
});

/** Post a comment (shows immediately; admin can delete later). */
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

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data, error } = await admin
    .from("comments")
    .insert({ post_slug: d.slug, name: d.name, body: d.body })
    .select("id,name,body,created_at")
    .single();
  if (error) return NextResponse.json({ error: "Could not post comment" }, { status: 502 });

  revalidatePath(`/blog/${d.slug}`);
  return NextResponse.json({ comment: data });
}
