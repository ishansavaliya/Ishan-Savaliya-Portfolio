"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

/** Landing contact form — posts to /api/contact (Supabase + Gmail SMTP). */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;

    const fe: Record<string, string> = {};
    if (!d.name?.trim() || d.name.trim().length < 2) fe.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || "")) fe.email = "Enter a valid email.";
    if (!d.body?.trim() || d.body.trim().length < 10) fe.body = "Message is too short.";
    if (Object.keys(fe).length) {
      setErrors(fe);
      return;
    }
    setErrors({});
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong");
      }
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-glass-border p-8 text-center">
        <CheckCircle2 size={48} className="text-accent-green" />
        <p className="font-medium">Message sent!</p>
        <p className="text-sm text-os-muted">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-glass-border bg-[var(--os-bg)] px-3.5 py-2.5 text-sm outline-none transition focus:border-accent placeholder:text-os-muted";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <input type="text" name="company" className="hidden" tabIndex={-1} />
      <div>
        <input name="name" placeholder="Your name" className={field} />
        {errors.name && <p className="mt-1 text-xs text-accent-red">{errors.name}</p>}
      </div>
      <div>
        <input name="email" type="email" placeholder="you@email.com" className={field} />
        {errors.email && <p className="mt-1 text-xs text-accent-red">{errors.email}</p>}
      </div>
      <input name="subject" placeholder="Subject (optional)" className={field} />
      <div>
        <textarea name="body" rows={4} placeholder="Your message…" className={`${field} resize-none`} />
        {errors.body && <p className="mt-1 text-xs text-accent-red">{errors.body}</p>}
      </div>
      {status === "error" && (
        <p className="rounded-lg bg-accent-red/15 px-3 py-2 text-sm text-accent-red">{err}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          <><Send size={16} /> Send message</>
        )}
      </button>
    </form>
  );
}
