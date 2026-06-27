"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  PenLine,
  UploadCloud,
  X,
  Eye,
  ImageIcon,
} from "lucide-react";
import { Markdown } from "@/components/blog/Markdown";

/**
 * Standalone "Write a Blog" app — visitors submit a post for review. Saved as a
 * draft + emails Ishan (approval) and the author (confirmation).
 */
export function WriteBlog() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function onPickCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blog-image", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) setUploadErr(j.error || "Upload failed.");
      else setCoverUrl(j.url);
    } catch {
      setUploadErr("Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;

    // Custom, in-app validation (no native browser popups).
    const fieldErrors: Record<string, string> = {};
    if (!payload.authorName?.trim() || payload.authorName.trim().length < 2)
      fieldErrors.authorName = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.authorEmail || ""))
      fieldErrors.authorEmail = "Enter a valid email address.";
    if (!/^https?:\/\/.+/.test(payload.authorUrl || ""))
      fieldErrors.authorUrl = "Add a link (LinkedIn / GitHub / site) for credit.";
    if (!payload.title?.trim() || payload.title.trim().length < 4)
      fieldErrors.title = "Give your post a title (4+ characters).";
    if (!payload.body?.trim() || payload.body.trim().length < 50)
      fieldErrors.body = "Your post is a bit short (at least 50 characters).";

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/blog-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Submission failed");
      }
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }

  const fieldErr = (name: string) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-accent-red">{errors[name]}</p>
    ) : null;

  // Theme-aware field styling — readable on both the light /(site) page and the dark OS window.
  const baseField =
    "w-full rounded-lg border bg-[var(--glass-bg)] px-3 py-2.5 text-sm text-os-fg outline-none transition focus:ring-2 placeholder:text-os-muted";
  const field = `${baseField} border-glass-border focus:border-accent focus:ring-accent/40`;
  // field with red state when that field has an error
  const fieldFor = (name: string) =>
    errors[name]
      ? `${baseField} border-accent-red ring-1 ring-accent-red/40 focus:border-accent-red focus:ring-accent-red/40`
      : field;
  const labelCls = "mb-1 block text-xs font-medium text-os-muted";

  if (status === "sent") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <CheckCircle2 size={52} className="text-accent-green" />
        <h2 className="text-2xl font-semibold">Submitted for review!</h2>
        <p className="max-w-sm text-os-muted">
          Thanks — Ishan will review your post. You&apos;ll get a confirmation
          email, and it appears on the blog once approved.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Write another
        </button>
      </div>
    );
  }

  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="os-scroll selectable h-full overflow-y-auto p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
          <PenLine size={18} className="text-accent" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Write a blog post</h1>
          <p className="text-sm text-os-muted">
            Share an article — reviewed before it goes live.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
        {/* ---------- form ---------- */}
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <input type="text" name="company" className="hidden" tabIndex={-1} />
          {Object.keys(errors).length > 0 && (
            <div className="rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2.5 text-sm text-accent-red">
              Please fix the highlighted fields below.
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Your name *</label>
              <input
                name="authorName"
                placeholder="Jane Doe"
                className={fieldFor("authorName")}
                maxLength={80}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
              {fieldErr("authorName")}
            </div>
            <div>
              <label className={labelCls}>Your email *</label>
              <input name="authorEmail" type="email" placeholder="jane@example.com" className={fieldFor("authorEmail")} maxLength={120} />
              {fieldErr("authorEmail")}
            </div>
          </div>
          <div>
            <label className={labelCls}>Your link for credit *</label>
            <input
              name="authorUrl"
              type="url"
              placeholder="https://linkedin.com/in/you (LinkedIn / GitHub / site)"
              className={fieldFor("authorUrl")}
              maxLength={300}
            />
            {fieldErr("authorUrl")}
          </div>
          <div>
            <label className={labelCls}>
              Post title * <span className="text-os-muted/70">({title.length}/160)</span>
            </label>
            <input
              name="title"
              placeholder="A clear, specific headline"
              className={fieldFor("title")}
              maxLength={160}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {fieldErr("title")}
          </div>
          <div>
            <label className={labelCls}>Tags</label>
            <input
              name="tags"
              placeholder="AI, Next.js, Career"
              className={field}
              maxLength={200}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Cover image (optional)</label>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-glass-border bg-[var(--glass-bg)] px-3 py-2.5 text-sm hover:border-accent">
                {uploading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <UploadCloud size={15} />
                )}
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickCover}
                  disabled={uploading}
                />
              </label>
              <input
                name="coverImage"
                type="url"
                placeholder="…or paste an image URL"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className={`${field} flex-1`}
                maxLength={500}
              />
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl("")}
                  aria-label="Remove cover"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-accent-red hover:bg-accent-red/10"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {uploadErr && <p className="mt-1 text-xs text-accent-red">{uploadErr}</p>}
          </div>
          <div>
            <label className={labelCls}>
              Short excerpt (optional){" "}
              <span className="text-os-muted/70">({excerpt.length}/300)</span>
            </label>
            <textarea
              name="excerpt"
              placeholder="One or two sentences that summarise the post."
              rows={2}
              maxLength={300}
              className={`${field} resize-none`}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>
              Body * <span className="text-os-muted/70">({body.length}/20000 · Markdown)</span>
            </label>
            <textarea
              name="body"
              placeholder="Write your post… Markdown supported: ## heading, **bold**, - list, ```code```"
              rows={14}
              maxLength={20000}
              className={`${fieldFor("body")} resize-y font-mono text-[13px] leading-relaxed`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {fieldErr("body")}
          </div>
          {status === "error" && (
            <p className="rounded-lg bg-accent-red/15 px-3 py-2 text-sm text-accent-red">
              {err}
            </p>
          )}
          <p className="text-xs text-os-muted">
            By submitting you agree your post may appear on ishansavaliya.me after
            review.
          </p>
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <PenLine size={17} /> Submit for review
              </>
            )}
          </button>
        </form>

        {/* ---------- live preview ---------- */}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <div className="mb-2 flex items-center gap-1.5 text-sm text-os-muted">
            <Eye size={14} /> Live preview
          </div>
          <div className="os-scroll max-h-[70vh] overflow-y-auto rounded-2xl border border-glass-border bg-[var(--glass-bg)] p-5">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
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
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight">
              {title || "Untitled post"}
            </h1>
            {excerpt && <p className="mt-2 text-os-fg/70">{excerpt}</p>}
            <div className="mt-3 text-xs text-os-muted">
              By {authorName || "you"}
            </div>
            <div className="mt-5 border-t border-glass-border pt-5">
              {body.trim() ? (
                <Markdown source={body} />
              ) : (
                <p className="text-os-muted">Start writing — preview renders here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
