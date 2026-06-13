"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { APPS, DOCK_ORDER } from "@/lib/apps/registry";
import { useWindowStore } from "@/lib/store/useWindowStore";
import { AppGlyph } from "./icons";
import type { AppId } from "@/types/os";

interface Result {
  id: string;
  title: string;
  subtitle: string;
  appId: AppId;
  action: () => void;
}

export function Spotlight({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindowStore((s) => s.openApp);

  const allResults = useMemo<Result[]>(() => {
    const appResults = DOCK_ORDER.concat(
      (["resume"] as AppId[]).filter((id) => !DOCK_ORDER.includes(id))
    ).map((id) => {
      const app = APPS[id];
      return {
        id: `app-${id}`,
        title: app.title,
        subtitle: "Application",
        appId: id,
        action: () => {
          openApp(id);
          onClose();
        },
      };
    });
    return appResults;
  }, [openApp, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return allResults;
    const q = query.toLowerCase();
    return allResults.filter((r) => r.title.toLowerCase().includes(q));
  }, [query, allResults]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[selected]?.action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9500] flex items-start justify-center pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.97, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: -8 }}
            transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
            className="glass-strong w-[560px] max-w-[92vw] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <Search size={20} className="text-os-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Spotlight Search"
                className="selectable w-full bg-transparent text-lg outline-none placeholder:text-os-muted"
              />
            </div>
            {results.length > 0 && (
              <div className="os-scroll max-h-72 overflow-y-auto border-t border-glass-border py-1">
                {results.map((r, i) => (
                  <button
                    key={r.id}
                    onMouseEnter={() => setSelected(i)}
                    onClick={r.action}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left ${
                      i === selected ? "bg-accent/80 text-white" : ""
                    }`}
                  >
                    <AppGlyph appId={r.appId} size={32} />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">{r.title}</span>
                      <span
                        className={`text-xs ${
                          i === selected ? "text-white/80" : "text-os-muted"
                        }`}
                      >
                        {r.subtitle}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
