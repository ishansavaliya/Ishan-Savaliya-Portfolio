"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { getContent } from "@/lib/content";

interface Msg {
  role: "user" | "model";
  text: string;
}

const SUGGESTIONS = [
  "Tell me about Ishan's experience",
  "Show his React / Next.js projects",
  "What's his strongest stack?",
  "Is he available for work?",
];

const c = getContent();

export function AIAssistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "model",
      text: `Hi! I'm Ishan AI 👋 Ask me anything about ${c.profile.name} — his experience, projects, skills, or availability.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const history = messages.filter((_, i) => i > 0); // drop greeting
    setMessages((m) => [...m, { role: "user", text: q }, { role: "model", text: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history }),
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "model",
            text:
              j.error ||
              "Something went wrong. You can reach Ishan via the Contact app.",
          };
          return next;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: "model", text: acc };
          return next;
        });
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = {
          role: "model",
          text: "Network error — please try again.",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#1a1330]/40 to-transparent">
      {/* header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#b06bff] to-[#6a2bd6]">
          <Sparkles size={16} className="text-white" />
        </span>
        <div>
          <div className="text-sm font-semibold">Ishan AI</div>
          <div className="text-[11px] text-os-muted">
            Grounded on Ishan&apos;s real portfolio
          </div>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="os-scroll selectable flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-accent text-white"
                  : "rounded-bl-md bg-white/8 text-os-fg/90"
              }`}
            >
              {m.text || (busy && i === messages.length - 1 ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                ""
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] text-os-fg/80 ring-1 ring-white/10 hover:bg-white/12"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="flex shrink-0 items-center gap-2 border-t border-white/8 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about Ishan…"
          className="selectable flex-1 rounded-full bg-white/8 px-4 py-2.5 text-[14px] outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent placeholder:text-os-muted"
        />
        <button
          onClick={() => send(input)}
          disabled={busy || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition hover:opacity-90 disabled:opacity-40"
          aria-label="Send"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
        </button>
      </div>
    </div>
  );
}
