import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Public cover-image upload for the guest "Write a blog" form. Uploads to the
 * public `blog-images` bucket under a `submissions/` prefix. Constrained:
 * images only, ≤ 5 MB. Returns the public URL.
 */
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP or GIF image." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 413 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Uploads are not available right now." }, { status: 503 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "cover";
  const path = `submissions/${base}-${Date.now().toString(36)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await admin.storage
    .from("blog-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) {
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 502 });
  }

  const { data } = admin.storage.from("blog-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
