"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, CheckCircle2, Loader2, Mail } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { getContent } from "@/lib/content";
import { GitHub, Linkedin2, Globe } from "@/components/os/icons/brand";

const c = getContent();

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong");
      }
      setStatus("sent");
      reset();
    } catch (e) {
      setStatus("error");
      setServerError(e instanceof Error ? e.message : "Failed to send");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <CheckCircle2 size={56} className="text-accent-green" />
        <h2 className="text-2xl font-semibold">Message sent!</h2>
        <p className="max-w-sm text-os-muted">
          Thanks for reaching out — I&apos;ll get back to you soon. A confirmation
          is on its way to your inbox.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-lg bg-white/6 px-3 py-2.5 text-[15px] text-os-fg outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-accent placeholder:text-os-muted";

  return (
    <div className="os-scroll selectable h-full overflow-y-auto p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Get in touch</h1>
        <p className="text-sm text-os-muted">
          Have a project, role, or idea? Send me a message.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          {...register("company")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input placeholder="Your name" className={field} {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-xs text-accent-red">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              placeholder="you@email.com"
              className={field}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-accent-red">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div>
          <input placeholder="Subject (optional)" className={field} {...register("subject")} />
        </div>
        <div>
          <textarea
            placeholder="Your message…"
            rows={6}
            className={`${field} resize-none`}
            {...register("body")}
          />
          {errors.body && (
            <p className="mt-1 text-xs text-accent-red">{errors.body.message}</p>
          )}
        </div>

        {status === "error" && (
          <p className="rounded-lg bg-accent-red/15 px-3 py-2 text-sm text-accent-red">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={18} /> Send message
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-white/8 pt-5">
        <p className="mb-3 text-sm text-os-muted">Or reach me directly:</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <a
            href={`mailto:${c.profile.email}`}
            className="flex items-center gap-1.5 text-os-fg/80 hover:text-os-fg"
          >
            <Mail size={15} /> {c.profile.email}
          </a>
          {c.profile.socials
            .filter((s) => ["GitHub", "LinkedIn", "Portfolio"].includes(s.label))
            .map((s) => {
              const Icon =
                s.label === "GitHub" ? GitHub : s.label === "LinkedIn" ? Linkedin2 : Globe;
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-os-fg/80 hover:text-os-fg"
                >
                  <Icon size={15} /> {s.label}
                </a>
              );
            })}
        </div>
      </div>
    </div>
  );
}
