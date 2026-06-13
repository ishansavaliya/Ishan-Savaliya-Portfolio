"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

const c = getContent();

interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
  readonly?: boolean;
}

const STORAGE_KEY = "ishan-os-notes";

/** Ishan's pinned notes (read-only defaults shown to every visitor). */
const PINNED: Note[] = [
  {
    id: "pin-now",
    title: "What I'm building now",
    readonly: true,
    updatedAt: 0,
    body: "Currently a Full-Stack Developer Intern at EMGAGE — shipping production apps with React.js, Spring Boot, Hibernate and SQL.\n\nWorking with CI/CD (Jenkins), AWS (EC2/S3), GitLab workflows, and AI integrations including MCP architecture.",
  },
  {
    id: "pin-stack",
    title: "My go-to stack",
    readonly: true,
    updatedAt: 0,
    body: `Frontend: ${c.skills.find((s) => s.id === "frontend")?.skills.map((k) => k.name).join(", ")}\n\nBackend: ${c.skills.find((s) => s.id === "backend")?.skills.map((k) => k.name).join(", ")}\n\nDatabases: ${c.skills.find((s) => s.id === "databases")?.skills.map((k) => k.name).join(", ")}`,
  },
];

export function Notes() {
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string>(PINNED[0].id);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUserNotes(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // Persist on change (debounced).
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userNotes));
    }, 300);
  }, [userNotes, loaded]);

  const all = [...PINNED, ...userNotes];
  const active = all.find((n) => n.id === activeId) ?? PINNED[0];

  function addNote() {
    const id = `note-${Date.now()}`;
    setUserNotes((n) => [
      { id, title: "New note", body: "", updatedAt: Date.now() },
      ...n,
    ]);
    setActiveId(id);
  }

  function updateActive(patch: Partial<Note>) {
    if (active.readonly) return;
    setUserNotes((notes) =>
      notes.map((n) =>
        n.id === active.id ? { ...n, ...patch, updatedAt: Date.now() } : n
      )
    );
  }

  function deleteNote(id: string) {
    setUserNotes((notes) => notes.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(PINNED[0].id);
  }

  return (
    <div className="flex h-full bg-[#1e1c17]/30">
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/8 bg-black/15">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-os-muted">
            Notes
          </span>
          <button
            onClick={addNote}
            className="rounded p-1 text-accent-yellow hover:bg-white/10"
            title="New note"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="os-scroll flex-1 overflow-y-auto">
          {all.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={cn(
                "group flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left",
                activeId === n.id ? "bg-accent-yellow/15" : "hover:bg-white/5"
              )}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {n.title || "Untitled"}
                </div>
                <div className="truncate text-xs text-os-muted">
                  {n.readonly ? "Pinned · Ishan" : n.body.slice(0, 32) || "No text"}
                </div>
              </div>
              {!n.readonly && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(n.id);
                  }}
                  className="ml-2 hidden shrink-0 rounded p-1 text-os-muted hover:text-accent-red group-hover:block"
                >
                  <Trash2 size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <div className="selectable flex flex-1 flex-col p-8">
        {active.readonly ? (
          <>
            <h1 className="text-2xl font-semibold">{active.title}</h1>
            <div className="mt-1 text-sm text-os-muted">Pinned by Ishan</div>
            <p className="mt-5 whitespace-pre-wrap leading-relaxed text-os-fg/85">
              {active.body}
            </p>
          </>
        ) : (
          <>
            <input
              value={active.title}
              onChange={(e) => updateActive({ title: e.target.value })}
              placeholder="Title"
              className="bg-transparent text-2xl font-semibold outline-none placeholder:text-os-muted"
            />
            <div className="mt-1 text-xs text-os-muted">
              Saved locally on your device
            </div>
            <textarea
              value={active.body}
              onChange={(e) => updateActive({ body: e.target.value })}
              placeholder="Start typing…"
              className="mt-4 flex-1 resize-none bg-transparent leading-relaxed text-os-fg/85 outline-none placeholder:text-os-muted"
            />
          </>
        )}
      </div>
    </div>
  );
}
