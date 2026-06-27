"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signOut() {
  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect("/is-control-portal/login");
}

export async function markMessageRead(id: string, read: boolean) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("messages").update({ read }).eq("id", id);
  revalidatePath("/is-control-portal/messages");
}

export async function deleteMessage(id: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/is-control-portal/messages");
}

export async function setAnnouncement(message: string, active: boolean) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("announcements").insert({ message, active });
  revalidatePath("/is-control-portal/announcements");
  revalidatePath("/");
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("announcements").delete().eq("id", id);
  revalidatePath("/is-control-portal/announcements");
  revalidatePath("/");
}

export async function toggleAnnouncement(id: string, active: boolean) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  // only one active banner at a time — clear others when activating
  if (active) await supabase.from("announcements").update({ active: false }).neq("id", id);
  await supabase.from("announcements").update({ active }).eq("id", id);
  revalidatePath("/is-control-portal/announcements");
  revalidatePath("/");
}

export async function toggleTestimonial(id: string, approved: boolean) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("testimonials").update({ approved }).eq("id", id);
  revalidatePath("/is-control-portal/testimonials");
}

/* ---------------------------------------------------------------- Blogs */

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readingTime(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).length / 200));
}

export async function saveBlog(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) return;

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "on";
  const authorName = String(formData.get("authorName") || "").trim();
  const authorUrl = String(formData.get("authorUrl") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  // Admin-managed date + reading time (fall back to today / auto-estimate).
  const dateInput = String(formData.get("publishedAt") || "").trim();
  const rtInput = parseInt(String(formData.get("readingTime") || ""), 10);
  const likesInput = parseInt(String(formData.get("likes") || ""), 10);
  if (!title || !body) return;

  const publishedAt = dateInput
    ? new Date(dateInput).toISOString()
    : published
      ? new Date().toISOString()
      : null;

  const slug = String(formData.get("slug") || "").trim() || slugify(title);
  const row: Record<string, unknown> = {
    slug,
    title,
    excerpt,
    body,
    tags,
    reading_time: Number.isFinite(rtInput) && rtInput > 0 ? rtInput : readingTime(body),
    published,
    published_at: publishedAt,
    author_name: authorName || null,
    author_url: authorUrl || null,
  };
  // Only overwrite cover when a value is provided (keeps existing on edit).
  if (coverImage) row.cover_image = coverImage;
  // Only set likes when an explicit non-negative number was entered.
  if (Number.isFinite(likesInput) && likesInput >= 0) row.likes = likesInput;

  if (id) {
    await supabase.from("blogs").update(row).eq("id", id);
  } else {
    await supabase.from("blogs").insert(row);
  }

  revalidatePath("/is-control-portal/blogs");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/is-control-portal/blogs");
}

/**
 * Upload a cover image to the public "blog-images" bucket; returns its public
 * URL. Used by the admin blog form (client calls this server action).
 */
export async function uploadBlogImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file" };
  if (!file.type.startsWith("image/")) return { error: "Not an image" };
  if (file.size > 5 * 1024 * 1024) return { error: "Image must be under 5 MB" };

  const admin = createAdminClient();
  if (!admin) return { error: "Storage not configured" };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `covers/${slugify(file.name.replace(/\.[^.]+$/, ""))}-${Date.now().toString(36)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await admin.storage
    .from("blog-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };

  const { data } = admin.storage.from("blog-images").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function deleteComment(id: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("comments").delete().eq("id", id);
  revalidatePath("/is-control-portal/comments");
}

export async function setBlogLikes(id: string, slug: string, likes: number) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("blogs").update({ likes: Math.max(0, likes) }).eq("id", id);
  revalidatePath("/is-control-portal/blogs");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
}

export async function deleteBlog(id: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase.from("blogs").delete().eq("id", id);
  revalidatePath("/is-control-portal/blogs");
  revalidatePath("/blog");
}

export async function togglePublish(id: string, published: boolean) {
  const supabase = await createServerSupabase();
  if (!supabase) return;
  await supabase
    .from("blogs")
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePath("/is-control-portal/blogs");
  revalidatePath("/blog");
}
