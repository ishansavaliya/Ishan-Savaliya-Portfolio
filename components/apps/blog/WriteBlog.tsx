"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, PenLine } from "lucide-react";

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

  const field =
    "w-full rounded-lg bg-white/6 px-3 py-2.5 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent placeholder:text-os-muted";

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

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <input type="text" name="company" className="hidden" tabIndex={-1} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input name="authorName" placeholder="Your name" className={field} />
            {fieldErr("authorName")}
          </div>
          <div>
            <input name="authorEmail" type="email" placeholder="Your email" className={field} />
            {fieldErr("authorEmail")}
          </div>
        </div>
        <div>
          <input name="title" placeholder="Post title" className={field} />
          {fieldErr("title")}
        </div>
        <input name="tags" placeholder="Tags (comma-separated, e.g. AI, Next.js)" className={field} />
        <textarea name="excerpt" placeholder="Short excerpt (optional)" rows={2} className={`${field} resize-none`} />
        <div>
          <textarea
            name="body"
            placeholder="Write your post… Markdown supported: ## heading, **bold**, - list, ```code```"
            rows={12}
            className={`${field} resize-none font-mono text-[13px]`}
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
    </div>
  );
}
