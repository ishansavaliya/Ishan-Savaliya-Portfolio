"use client";

import { useWindowStore } from "@/lib/store/useWindowStore";
import { APPS, DOCK_ORDER } from "@/lib/apps/registry";
import { AppGlyph } from "@/components/os/icons";
import type { AppId } from "@/types/os";

/** Full-screen Launchpad grid of all apps. */
export function Launchpad() {
  const { openApp, windows, closeWindow } = useWindowStore();

  // The launchpad's own window id (so we can close it after launching an app).
  const selfId = windows.find((w) => w.appId === "launchpad")?.id;

  const ids: AppId[] = [
    ...DOCK_ORDER.filter((id) => id !== "launchpad"),
    "resume",
  ];
  const apps = ids.map((id) => APPS[id]);

  function launch(id: AppId) {
    openApp(id);
    if (selfId) closeWindow(selfId);
  }

  return (
    <div className="flex h-full items-start justify-center overflow-y-auto bg-black/40 p-12 backdrop-blur-2xl">
      <div className="grid w-full max-w-3xl grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-5">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => launch(app.id)}
            className="group flex flex-col items-center gap-2"
          >
            <span className="transition-transform group-hover:scale-110">
              <AppGlyph appId={app.id} size={72} />
            </span>
            <span className="text-[13px] font-medium text-white drop-shadow">
              {app.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
