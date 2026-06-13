// SERVER-ONLY: reads blog posts from Supabase, falling back to the bundled
// file-based posts when the DB is unconfigured/empty. Used by the public blog
// routes (ISR) and the admin.
import type { BlogPost } from "@/types/blog";
import { POSTS as FILE_POSTS } from "@/content/posts";
import { createServerSupabase } from "@/lib/supabase/server";

interface BlogRow {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  tags: string[] | null;
  cover_image: string | null;
  reading_time: number | null;
  published: boolean;
  published_at: string | null;
}

const FALLBACK_GRADIENT =
  "radial-gradient(120% 120% at 70% 20%, #3a2b6b 0%, #1b1d4e 40%, #0a0c1f 100%)";

function rowToPost(r: BlogRow): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: r.body ?? "",
    tags: r.tags ?? [],
    category: r.tags?.[0] ?? "Article",
    publishedAt: r.published_at ?? new Date().toISOString(),
    readingTime: r.reading_time ?? 5,
    // cover_image stores a CSS gradient (or could be a URL later).
    coverGradient: r.cover_image ?? FALLBACK_GRADIENT,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return sortByDate(FILE_POSTS);

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return sortByDate(FILE_POSTS);
  return (data as BlogRow[]).map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return rowToPost(data as BlogRow);
  }
  return FILE_POSTS.find((p) => p.slug === slug) ?? null;
}

/** Slugs for generateStaticParams — uses file posts so the build never needs DB. */
export function staticSlugs() {
  return FILE_POSTS.map((p) => ({ slug: p.slug }));
}

function sortByDate(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
