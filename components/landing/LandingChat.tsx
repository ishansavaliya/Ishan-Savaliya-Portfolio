"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { AIAssistant } from "@/components/apps/ai/AIAssistant";

/**
 * Floating "Ishan AI" chat widget for the static landing page. Reuses the same
 * AIAssistant component (and /api/chat backend) as the OS app — opens in a
 * bottom-right panel instead of a window.
 */
export function LandingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[120] flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-glass-border bg-[var(--glass-bg-strong)] shadow-2xl backdrop-blur-xl">
          <AIAssistant />
        </div>
      )}

      {/* launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Ishan AI" : "Ask Ishan AI"}
        className="fixed bottom-5 right-5 z-[120] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-pink text-white shadow-[0_10px_30px_-8px_var(--accent)] transition hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>
    </>
  );
}
