"use client";

import { AppGlyph } from "./icons";
import type { AppId } from "@/types/os";

const ICONS: { appId: AppId; label: string }[] = [
  { appId: "finder", label: "About Ishan" },
  { appId: "vscode", label: "VS Code" },
  { appId: "contact", label: "Contact Me" },
  { appId: "browser", label: "Browser" },
  { appId: "ai-assistant", label: "Ask Ishan AI" },
];

/** Right-aligned desktop shortcut icons (double-click to open). */
export function DesktopIcons({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <div className="absolute right-4 top-10 z-[10] flex flex-col gap-5">
      {ICONS.map(({ appId, label }) => (
        <button
          key={label}
          onDoubleClick={() => onOpen(appId)}
          onClick={(e) => e.detail === 0 && onOpen(appId)}
          className="group flex w-20 flex-col items-center gap-1 rounded-lg p-1 text-center focus:bg-white/15"
        >
          <AppGlyph appId={appId} size={52} />
          <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
