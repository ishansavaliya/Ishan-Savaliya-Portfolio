import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { BlogForm } from "../BlogForm";

export default async function EditBlog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = supabase
    ? await supabase.from("blogs").select("*").eq("id", id).maybeSingle()
    : { data: null };
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit blog post</h1>
      <BlogForm
        blog={{
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt ?? "",
          body: data.body ?? "",
          tags: data.tags ?? [],
          published: data.published,
          authorName: data.author_name ?? "",
          authorUrl: data.author_url ?? "",
          coverImage:
            data.cover_image && /^(https?:\/\/|\/)/.test(data.cover_image)
              ? data.cover_image
              : "",
          publishedAt: data.published_at ?? "",
          readingTime: data.reading_time ?? undefined,
          likes: data.likes ?? 0,
        }}
      />
    </div>
  );
}
