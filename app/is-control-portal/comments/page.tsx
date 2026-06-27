import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { deleteComment } from "../actions";

interface C {
  id: string;
  post_slug: string;
  name: string;
  body: string;
  created_at: string;
}

export default async function CommentsPage() {
  const supabase = await createServerSupabase();
  const { data } = supabase
    ? await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false })
    : { data: [] as C[] };
  const items = (data ?? []) as C[];

  async function remove(formData: FormData) {
    "use server";
    await deleteComment(String(formData.get("id")));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Comments</h1>
      <p className="mt-1 text-os-muted">
        Reader comments across all posts. Delete any that don&apos;t belong.
      </p>

      <div className="mt-6 space-y-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-os-muted">·</span>
                  <Link
                    href={`/blog/${c.post_slug}`}
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    {c.post_slug} <ExternalLink size={12} />
                  </Link>
                  <span className="text-os-muted">·</span>
                  <span className="text-xs text-os-muted">
                    {new Date(c.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-os-fg/85">
                  {c.body}
                </p>
              </div>
              <form action={remove}>
                <input type="hidden" name="id" value={c.id} />
                <button
                  aria-label="Delete comment"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-os-muted transition hover:bg-accent-red/15 hover:text-accent-red"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-os-muted">No comments yet.</p>}
      </div>
    </div>
  );
}
