import Link from "next/link";
import { saveBlog } from "../actions";

interface BlogData {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  tags?: string[];
  published?: boolean;
}

export function BlogForm({ blog }: { blog?: BlogData }) {
  const field =
    "w-full rounded-lg bg-white/6 px-3 py-2.5 text-[15px] outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent placeholder:text-os-muted";

  return (
    <form action={saveBlog} className="max-w-2xl space-y-4">
      {blog?.id && <input type="hidden" name="id" value={blog.id} />}
      <div>
        <label className="mb-1 block text-sm text-os-muted">Title</label>
        <input name="title" defaultValue={blog?.title} className={field} required />
      </div>
      <div>
        <label className="mb-1 block text-sm text-os-muted">
          Slug (leave blank to auto-generate)
        </label>
        <input name="slug" defaultValue={blog?.slug} className={field} placeholder="my-post-slug" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-os-muted">Excerpt</label>
        <textarea name="excerpt" defaultValue={blog?.excerpt} rows={2} className={`${field} resize-none`} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-os-muted">Tags (comma-separated)</label>
        <input
          name="tags"
          defaultValue={blog?.tags?.join(", ")}
          className={field}
          placeholder="AI, Next.js, Career"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-os-muted">
          Body (Markdown: ## headings, ```code```, - lists, **bold**)
        </label>
        <textarea
          name="body"
          defaultValue={blog?.body}
          rows={18}
          className={`${field} font-mono text-[13px]`}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={blog?.published ?? true} />
        Published (visible on the public blog)
      </label>
      <div className="flex gap-3 pt-2">
        <button className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white hover:opacity-90">
          Save post
        </button>
        <Link
          href="/is-control-portal/blogs"
          className="rounded-lg bg-white/10 px-5 py-2.5 text-sm hover:bg-white/15"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
