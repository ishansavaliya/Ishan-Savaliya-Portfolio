"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

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
  if (!title || !body) return;

  const slug = String(formData.get("slug") || "").trim() || slugify(title);
  const row = {
    slug,
    title,
    excerpt,
    body,
    tags,
    reading_time: readingTime(body),
    published,
    published_at: published ? new Date().toISOString() : null,
  };

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
