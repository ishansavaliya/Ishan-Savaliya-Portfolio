"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, MessageCircle, Send } from "lucide-react";
import type { BlogComment } from "@/types/blog";

interface Props {
  slug: string;
  initialLikes: number;
  initialComments: BlogComment[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Deterministic date format (no locale) — identical on server + client. */
function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function BlogEngagement({ slug, initialLikes, initialComments }: Props) {
  const storageKey = `liked:${slug}`;
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");

  // hydrate liked state from localStorage (client-only)
  useEffect(() => {
    setLiked(window.localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  async function toggleLike() {
    if (likeBusy) return;
    const delta = liked ? -1 : 1;
    // optimistic
    setLiked(!liked);
    setLikes((n) => Math.max(0, n + delta));
    setLikeBusy(true);
    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, delta }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && typeof j.likes === "number") setLikes(j.likes);
      if (typeof window !== "undefined") {
        if (delta === 1) window.localStorage.setItem(storageKey, "1");
        else window.localStorage.removeItem(storageKey);
      }
    } catch {
      // revert on failure
      setLiked(liked);
      setLikes((n) => Math.max(0, n - delta));
    } finally {
      setLikeBusy(false);
    }
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr("Add your name.");
    if (!text.trim()) return setErr("Write a comment.");
    setPosting(true);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: name.trim(), body: text.trim() }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.comment) {
        setErr("Could not post. Try again.");
        return;
      }
      setComments((c) => [
        {
          id: j.comment.id,
          postSlug: slug,
          name: j.comment.name,
          body: j.comment.body,
          createdAt: j.comment.created_at,
        },
        ...c,
      ]);
      setText("");
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setPosting(false);
    }
  }

  const field =
    "w-full rounded-lg border border-glass-border bg-[var(--glass-bg)] px-3 py-2.5 text-sm text-os-fg outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40 placeholder:text-os-muted";

  return (
    <section className="mt-12 border-t border-white/10 pt-8">
      {/* like bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          aria-pressed={liked}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            liked
              ? "border-accent-pink/40 bg-accent-pink/10 text-accent-pink"
              : "border-glass-border text-os-fg/80 hover:border-accent-pink/40 hover:text-accent-pink"
          }`}
        >
          <Heart size={16} className={liked ? "fill-current" : ""} />
          {likes}
          <span className="text-os-muted">{likes === 1 ? "like" : "likes"}</span>
        </button>
        <span className="flex items-center gap-1.5 text-sm text-os-muted">
          <MessageCircle size={15} /> {comments.length}{" "}
          {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {/* comment form */}
      <form onSubmit={postComment} className="mt-6 space-y-3">
        <input type="text" name="company" className="hidden" tabIndex={-1} />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          className={`${field} max-w-xs`}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          rows={3}
          maxLength={2000}
          className={`${field} resize-none`}
        />
        {err && <p className="text-xs text-accent-red">{err}</p>}
        <button
          disabled={posting}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          Post comment
        </button>
      </form>

      {/* comments list */}
      <div className="mt-8 space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-os-muted">Be the first to comment.</p>
        )}
        {comments.map((cm) => (
          <div key={cm.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                {cm.name.charAt(0).toUpperCase()}
              </span>
              <div className="text-sm">
                <div className="font-medium text-os-fg">{cm.name}</div>
                <div className="text-xs text-os-muted">{fmtDate(cm.createdAt)}</div>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-os-fg/85">
              {cm.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
