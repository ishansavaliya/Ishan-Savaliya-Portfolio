"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Loader2,
  UploadCloud,
  ImageIcon,
  Eye,
  Save,
  X,
} from "lucide-react";
import { saveBlog, uploadBlogImage } from "../actions";
import { Markdown } from "@/components/blog/Markdown";

interface BlogData {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  tags?: string[];
  published?: boolean;
  authorName?: string;
  authorUrl?: string;
  coverImage?: string;
  publishedAt?: string; // ISO or yyyy-mm-dd
  readingTime?: number;
  likes?: number;
}

const field =
  "w-full rounded-lg bg-white/6 px-3 py-2.5 text-[15px] outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent placeholder:text-os-muted";
const labelCls = "mb-1 block text-sm text-os-muted";

export function BlogForm({ blog }: { blog?: BlogData }) {
  const [title, setTitle] = useState(blog?.title ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [tags, setTags] = useState(blog?.tags?.join(", ") ?? "");
  const [body, setBody] = useState(blog?.body ?? "");
  const [authorName, setAuthorName] = useState(blog?.authorName ?? "Ishan Savaliya");
  const [authorUrl, setAuthorUrl] = useState(
    blog?.authorUrl ?? "https://www.ishansavaliya.me"
  );
  const [coverImage, setCoverImage] = useState(blog?.coverImage ?? "");
  const [publishedAt, setPublishedAt] = useState(
    blog?.publishedAt ? blog.publishedAt.slice(0, 10) : ""
  );
  const [readingTime, setReadingTime] = useState(
    blog?.readingTime ? String(blog.readingTime) : ""
  );
  const [likes, setLikes] = useState(
    blog?.likes != null ? String(blog.likes) : ""
  );
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [pending, startTransition] = useTransition();

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadBlogImage(fd);
      if (res.error) setUploadErr(res.error);
      else if (res.url) setCoverImage(res.url);
    } catch {
      setUploadErr("Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => {
      saveBlog(fd);
    });
  }

  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      {/* hidden id */}
      {blog?.id && <input type="hidden" name="id" value={blog.id} />}
      <input type="hidden" name="coverImage" value={coverImage} />

      {/* ---------- left: editor ---------- */}
      <div className="space-y-4">
        <div>
          <label className={labelCls}>
            Title <span className="text-os-muted/70">({title.length}/160)</span>
          </label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={field}
            maxLength={160}
            required
          />
        </div>

        <div>
          <label className={labelCls}>Slug (leave blank to auto-generate)</label>
          <input
            name="slug"
            defaultValue={blog?.slug}
            className={field}
            placeholder="my-post-slug"
          />
        </div>

        {/* author credit — required */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Author name *</label>
            <input
              name="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={field}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Author link (social / site) *</label>
            <input
              name="authorUrl"
              type="url"
              value={authorUrl}
              onChange={(e) => setAuthorUrl(e.target.value)}
              className={field}
              placeholder="https://linkedin.com/in/…"
              required
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>
            Excerpt <span className="text-os-muted/70">({excerpt.length}/300)</span>
          </label>
          <textarea
            name="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            maxLength={300}
            className={`${field} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Tags (comma-separated)</label>
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={field}
            maxLength={200}
            placeholder="AI, Next.js, Career"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Publish date</label>
            <input
              name="publishedAt"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label className={labelCls}>Read (min)</label>
            <input
              name="readingTime"
              type="number"
              min={1}
              max={120}
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              className={field}
              placeholder="auto"
            />
          </div>
          <div>
            <label className={labelCls}>Likes</label>
            <input
              name="likes"
              type="number"
              min={0}
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              className={field}
              placeholder="0"
            />
          </div>
        </div>

        {/* cover image upload */}
        <div>
          <label className={labelCls}>Cover image</label>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/8 px-3 py-2.5 text-sm hover:bg-white/12">
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UploadCloud size={16} />
              )}
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
                disabled={uploading}
              />
            </label>
            {coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs text-accent-red hover:bg-white/8"
              >
                <X size={14} /> Remove
              </button>
            )}
            <span className="text-xs text-os-muted">JPG/PNG/WebP · ≤ 5 MB</span>
          </div>
          {uploadErr && (
            <p className="mt-1 text-xs text-accent-red">{uploadErr}</p>
          )}
        </div>

        <div>
          <label className={labelCls}>
            Body (Markdown: ## headings, ```code```, - lists, **bold**)
          </label>
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            className={`${field} os-scroll resize-y font-mono text-[13px] leading-relaxed`}
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={blog?.published ?? true}
          />
          Published (visible on the public blog)
        </label>

        <div className="flex gap-3 pt-1">
          <button
            disabled={pending}
            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save post
          </button>
          <Link
            href="/is-control-portal/blogs"
            className="rounded-lg bg-white/10 px-5 py-2.5 text-sm hover:bg-white/15"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* ---------- right: live preview ---------- */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="mb-2 flex items-center gap-1.5 text-sm text-os-muted">
          <Eye size={14} /> Live preview
        </div>
        <div className="os-scroll max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt=""
              className="mb-4 h-44 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mb-4 flex h-44 w-full items-center justify-center rounded-xl bg-white/5 text-os-muted">
              <ImageIcon size={28} />
            </div>
          )}
          {tagList.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tagList.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] text-os-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            {title || "Untitled post"}
          </h1>
          {excerpt && <p className="mt-2 text-os-fg/70">{excerpt}</p>}
          <div className="mt-3 flex items-center gap-2 text-xs text-os-muted">
            <span>By {authorName || "—"}</span>
          </div>
          <div className="mt-5 border-t border-white/10 pt-5">
            {body.trim() ? (
              <Markdown source={body} />
            ) : (
              <p className="text-os-muted">Start writing — preview renders here.</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
