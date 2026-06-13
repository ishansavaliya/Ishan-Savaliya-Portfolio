"use client";

import { Download, ExternalLink } from "lucide-react";
import { getContent } from "@/lib/content";

const c = getContent();

export function Resume() {
  return (
    <div className="flex h-full flex-col bg-[#2a2a2a]">
      <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 py-2">
        <span className="text-sm font-medium">
          {c.profile.name} — Resume
        </span>
        <div className="flex gap-2">
          <a
            href={c.profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
          >
            <ExternalLink size={13} /> Open
          </a>
          <a
            href={c.profile.resumeUrl}
            download
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
          >
            <Download size={13} /> Download
          </a>
        </div>
      </div>
      <object
        data={`${c.profile.resumeUrl}#toolbar=0`}
        type="application/pdf"
        className="flex-1"
      >
        <div className="flex h-full items-center justify-center p-8 text-center text-os-muted">
          <div>
            <p>Preview unavailable in this browser.</p>
            <a
              href={c.profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-accent hover:underline"
            >
              Open the resume in a new tab →
            </a>
          </div>
        </div>
      </object>
    </div>
  );
}
