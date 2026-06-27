import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  slug: z.string().min(1).max(120),
  delta: z.union([z.literal(1), z.literal(-1)]),
});

/** Atomically bump a post's like count by ±1. Returns the new total. */
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

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data, error } = await admin.rpc("bump_blog_likes", {
    p_slug: parsed.data.slug,
    p_delta: parsed.data.delta,
  });
  if (error) return NextResponse.json({ error: "Could not update" }, { status: 502 });

  return NextResponse.json({ likes: data ?? 0 });
}
