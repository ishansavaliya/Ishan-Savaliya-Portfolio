"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";

export function SubmitBlog({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
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

  const field =
    "w-full rounded-lg bg-white/6 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent placeholder:text-os-muted";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-6">
      <div className="liquid-glass max-h-full w-full max-w-lg overflow-y-auto rounded-2xl p-6 os-scroll">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Submit a blog post</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 size={48} className="text-accent-green" />
            <p className="font-medium">Submitted for review!</p>
            <p className="text-sm text-os-muted">
              Ishan will review your post. You&apos;ll get a confirmation email.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-lg bg-white/10 px-4 py-2 text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input type="text" name="company" className="hidden" tabIndex={-1} />
            <div className="grid grid-cols-2 gap-3">
              <input name="authorName" placeholder="Your name" className={field} required />
              <input name="authorEmail" type="email" placeholder="Your email" className={field} required />
            </div>
            <input name="title" placeholder="Post title" className={field} required />
            <input name="tags" placeholder="Tags (comma-separated)" className={field} />
            <textarea name="excerpt" placeholder="Short excerpt (optional)" rows={2} className={`${field} resize-none`} />
            <textarea
              name="body"
              placeholder="Write your post… (Markdown supported)"
              rows={8}
              className={`${field} resize-none font-mono text-[13px]`}
              required
            />
            {status === "error" && (
              <p className="text-sm text-accent-red">{err}</p>
            )}
            <p className="text-xs text-os-muted">
              Posts are reviewed before publishing. By submitting you agree it
              may appear on ishansavaliya.me.
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting…
                </>
              ) : (
                "Submit for review"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
