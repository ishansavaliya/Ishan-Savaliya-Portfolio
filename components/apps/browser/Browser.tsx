"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Home,
  ExternalLink,
} from "lucide-react";
import { getContent } from "@/lib/content";
import { allPosts } from "@/content/posts";
import { SubmitBlog } from "./SubmitBlog";

const c = getContent();

interface Bookmark {
  label: string;
  /** External link opens in a new browser tab. */
  url: string;
  color: string;
  initial: string;
}

/** External profiles — open in a real new tab (these block iframing). */
const EXTERNAL: Bookmark[] = [
  { label: "GitHub", url: "https://github.com/ishansavaliya", color: "#24292e", initial: "GH" },
  { label: "LinkedIn", url: "https://linkedin.com/in/iamishansavaliya", color: "#0a66c2", initial: "in" },
  { label: "LeetCode", url: "https://leetcode.com/u/ishansavaliya", color: "#ffa116", initial: "LC" },
  { label: "Codolio", url: "https://codolio.com/profile/ishansavaliya", color: "#6366f1", initial: "Co" },
  { label: "Farmzy", url: "https://www.farmzy.studio", color: "#16a34a", initial: "Fz" },
];

/** Internal site pages — these CAN be embedded in the in-OS browser iframe. */
const INTERNAL = [
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Experience", path: "/experience" },
  { label: "Skills", path: "/skills" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

export function Browser() {
  // path: internal site page (iframe). external: proxied URL. null: start page.
  const [path, setPath] = useState<string | null>(null);
  const [external, setExternal] = useState<string | null>(null);
  const [omnibox, setOmnibox] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function navigate(input: string) {
    const q = input.trim();
    if (!q) return;
    setPath(null);
    // URL vs search query.
    const looksLikeUrl = /^https?:\/\//i.test(q) || /^[\w-]+\.[a-z]{2,}/i.test(q);
    const url = looksLikeUrl
      ? q.startsWith("http")
        ? q
        : `https://${q}`
      : `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    setExternal(`/api/proxy?url=${encodeURIComponent(url)}`);
    setOmnibox(url);
  }

  function goHome() {
    setPath(null);
    setExternal(null);
    setOmnibox("");
  }

  const displayUrl = external
    ? omnibox
    : path
      ? `ishansavaliya.me${path}`
      : "ishan://start";

  return (
    <div className="relative flex h-full flex-col bg-[#1c1e26]">
      {submitting && <SubmitBlog onClose={() => setSubmitting(false)} />}
      {/* chrome */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/8 px-3">
        <div className="flex gap-1 text-os-muted">
          <button
            onClick={goHome}
            className="rounded p-1 hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <ArrowRight size={18} className="opacity-40" />
          <button
            onClick={() => external && setExternal(external + "&_=" + Date.now())}
            className="rounded p-1 hover:bg-white/10"
            aria-label="Reload"
          >
            <RotateCw size={15} />
          </button>
          <button
            onClick={goHome}
            className="rounded p-1 hover:bg-white/10"
            aria-label="Home"
          >
            <Home size={16} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(omnibox);
          }}
          className="flex flex-1 items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-sm text-os-fg/80"
        >
          <Lock size={12} className="text-accent-green" />
          <input
            value={external ? omnibox : ""}
            onChange={(e) => setOmnibox(e.target.value)}
            placeholder="Search Google or type a URL"
            className="selectable w-full bg-transparent outline-none placeholder:text-os-muted"
          />
        </form>
        {(path || external) && (
          <a
            href={external ? omnibox : path!}
            target="_blank"
            rel="noreferrer"
            className="rounded p-1 text-os-muted hover:bg-white/10"
            title="Open in new tab"
          >
            <ExternalLink size={15} />
          </a>
        )}
      </div>

      {external ? (
        // Real external site via the best-effort proxy.
        <iframe
          src={external}
          title="Web"
          className="flex-1 border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      ) : path ? (
        // In-OS browsing of our own crawlable pages.
        <iframe
          src={path}
          title={displayUrl}
          className="flex-1 border-0 bg-white"
        />
      ) : (
        // Start page.
        <div className="os-scroll flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-1 text-center text-2xl font-semibold">
              {c.profile.name}
            </h1>
            <p className="mb-8 text-center text-sm text-os-muted">
              Browse my portfolio · find me across the web
            </p>

            {/* internal pages — open in iframe */}
            <div className="mb-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-os-muted">
                Portfolio
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {INTERNAL.map((p) => (
                  <button
                    key={p.path}
                    onClick={() => setPath(p.path)}
                    className="rounded-lg bg-white/6 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* external profiles — open in a new tab */}
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-os-muted">
              Around the web
            </h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              {EXTERNAL.map((b) => (
                <a
                  key={b.label}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white ring-1 ring-white/15 transition group-hover:scale-105"
                    style={{ background: b.color }}
                  >
                    {b.initial}
                  </span>
                  <span className="text-xs text-os-fg/80">{b.label}</span>
                </a>
              ))}
            </div>

            {/* blog */}
            <div className="mb-3 mt-8 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-os-muted">
                From the blog
              </h2>
              <button
                onClick={() => setSubmitting(true)}
                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white hover:opacity-90"
              >
                ✍️ Write a post
              </button>
            </div>
            <div className="space-y-2">
              {allPosts().map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setPath(`/blog/${p.slug}`)}
                  className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left ring-1 ring-white/10 transition hover:bg-white/8"
                >
                  <span
                    className="h-10 w-10 shrink-0 rounded-lg"
                    style={{ background: p.coverGradient }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {p.title}
                    </span>
                    <span className="block text-xs text-os-muted">
                      {p.category} · {p.readingTime} min read
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
