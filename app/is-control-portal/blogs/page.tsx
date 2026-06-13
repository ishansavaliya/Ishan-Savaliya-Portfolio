import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { deleteBlog, togglePublish } from "../actions";

interface Blog {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  published_at: string | null;
}

export default async function BlogsAdmin() {
  const supabase = await createServerSupabase();
  const { data } = supabase
    ? await supabase
        .from("blogs")
        .select("id,slug,title,published,published_at")
        .order("published_at", { ascending: false, nullsFirst: false })
    : { data: [] as Blog[] };
  const blogs = (data ?? []) as Blog[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog posts</h1>
          <p className="mt-1 text-os-muted">{blogs.length} posts.</p>
        </div>
        <Link
          href="/is-control-portal/blogs/new"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> New post
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
          >
            <div className="min-w-0">
              <div className="truncate font-medium">{b.title}</div>
              <div className="text-xs text-os-muted">/blog/{b.slug}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <form action={togglePublish.bind(null, b.id, !b.published)}>
                <button
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    b.published
                      ? "bg-accent-green/20 text-accent-green"
                      : "bg-white/10 text-os-muted"
                  }`}
                >
                  {b.published ? "Published" : "Draft"}
                </button>
              </form>
              <Link
                href={`/is-control-portal/blogs/${b.id}`}
                className="rounded-lg p-2 text-os-muted hover:bg-white/10"
              >
                <Pencil size={15} />
              </Link>
              <form action={deleteBlog.bind(null, b.id)}>
                <button className="rounded-lg p-2 text-os-muted hover:bg-white/10 hover:text-accent-red">
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <p className="text-os-muted">No posts yet. Create your first one.</p>
        )}
      </div>
    </div>
  );
}
