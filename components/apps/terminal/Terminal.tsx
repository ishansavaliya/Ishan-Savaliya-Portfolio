"use client";

import { useEffect, useRef, useState } from "react";
import { useWindowStore } from "@/lib/store/useWindowStore";
import {
  runCommand,
  BANNER,
  COMMAND_NAMES,
} from "./commands";

interface Block {
  prompt?: string;
  lines: string[];
}

const PROMPT = "ishan@ishan-os ~ %";

export function Terminal() {
  const openApp = useWindowStore((s) => s.openApp);
  const [blocks, setBlocks] = useState<Block[]>([{ lines: BANNER }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [blocks]);

  function submit() {
    const cmd = input;
    const out = runCommand(cmd, {
      openApp,
      clear: () => setBlocks([]),
    });
    if (cmd.trim()) {
      setHistory((h) => [...h, cmd]);
    }
    setHistIndex(-1);
    if (out === null) {
      // clear handled inside runCommand
      setInput("");
      return;
    }
    setBlocks((b) => [...b, { prompt: cmd, lines: out.lines }]);
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIndex === -1 ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex === -1) return;
      const idx = histIndex + 1;
      if (idx >= history.length) {
        setHistIndex(-1);
        setInput("");
      } else {
        setHistIndex(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const word = input.split(/\s+/).pop() ?? "";
      if (!word) return;
      const matches = COMMAND_NAMES.filter((n) => n.startsWith(word));
      if (matches.length === 1) {
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(" ") + " ");
      } else if (matches.length > 1) {
        setBlocks((b) => [...b, { prompt: input, lines: [matches.join("  ")] }]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setBlocks([]);
    }
  }

  return (
    <div
      className="os-scroll selectable h-full overflow-y-auto bg-[#0c0e13]/85 p-3 font-mono text-[13px] leading-relaxed text-[#d6dbe3]"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {blocks.map((b, i) => (
        <div key={i} className="mb-1">
          {b.prompt !== undefined && (
            <div className="text-[#7dd3a0]">
              <span className="text-[#5aa9ff]">{PROMPT}</span> {b.prompt}
            </div>
          )}
          {b.lines.map((line, j) => (
            <Line key={j} text={line} />
          ))}
        </div>
      ))}

      {/* active prompt */}
      <div className="flex items-center">
        <span className="mr-2 whitespace-nowrap text-[#5aa9ff]">{PROMPT}</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent text-[#d6dbe3] caret-[#7dd3a0] outline-none"
        />
      </div>
    </div>
  );
}

/** Renders a single output line, linkifying URLs. */
function Line({ text }: { text: string }) {
  const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
  if (!urlMatch) return <div className="whitespace-pre-wrap">{text}</div>;
  const [before, after] = text.split(urlMatch[1]);
  return (
    <div className="whitespace-pre-wrap">
      {before}
      <a
        href={urlMatch[1]}
        target="_blank"
        rel="noreferrer"
        className="text-[#5aa9ff] underline hover:text-[#7dd3a0]"
      >
        {urlMatch[1]}
      </a>
      {after}
    </div>
  );
}
