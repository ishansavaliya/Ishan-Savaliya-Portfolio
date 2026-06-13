"use client";

import { useEffect, useRef, useState } from "react";
import {
  Monitor,
  Moon,
  Sun,
  Image as ImageIcon,
  User,
  Sparkles,
  Upload,
  Trash2,
} from "lucide-react";
import {
  WALLPAPERS,
  useSettingsStore,
} from "@/lib/store/useSettingsStore";
import {
  listWallpapers,
  saveWallpaper,
  deleteWallpaper,
  type CustomWallpaper,
} from "@/lib/wallpaperDB";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

const c = getContent();

export function Settings() {
  const {
    theme,
    setTheme,
    wallpaperId,
    setWallpaper,
    customWallpaper,
    setCustomWallpaper,
    reducedMotion,
    setReducedMotion,
  } = useSettingsStore();

  const [custom, setCustom] = useState<CustomWallpaper[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listWallpapers().then(setCustom).catch(() => {});
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5_000_000) {
      alert("Please choose an image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const w: CustomWallpaper = {
        id: `wp-${Date.now()}`,
        name: file.name,
        dataUrl,
      };
      // Apply immediately (synchronous store update → live re-render),
      // then persist to IndexedDB in the background.
      setCustomWallpaper(`url("${dataUrl}")`);
      setCustom((c) => [...c, w]);
      void saveWallpaper(w);
    };
    reader.readAsDataURL(file);
  }

  async function removeCustom(id: string, dataUrl: string) {
    await deleteWallpaper(id);
    setCustom((c) => c.filter((w) => w.id !== id));
    if (customWallpaper === `url(${dataUrl})`) setWallpaper("sonoma-dusk");
  }

  return (
    <div className="flex h-full">
      {/* sidebar */}
      <aside className="w-48 shrink-0 border-r border-white/8 bg-black/20 p-3">
        <div className="mb-4 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20">
            <User size={16} className="text-accent" />
          </span>
          <div className="text-sm">
            <div className="font-medium">{c.profile.name}</div>
            <div className="text-[11px] text-os-muted">Apple Account</div>
          </div>
        </div>
        {["Appearance", "Wallpaper", "Accessibility"].map((s) => (
          <div
            key={s}
            className="rounded-md px-3 py-1.5 text-[13px] text-os-fg/80"
          >
            {s}
          </div>
        ))}
      </aside>

      {/* content */}
      <div className="os-scroll flex-1 overflow-y-auto p-6">
        {/* Appearance */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Appearance</h2>
          <div className="flex gap-3">
            {[
              { id: "dark", label: "Dark", icon: Moon },
              { id: "light", label: "Light", icon: Sun },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as "dark" | "light")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-4 ring-1 transition",
                    theme === t.id
                      ? "bg-accent/15 ring-accent"
                      : "bg-white/5 ring-white/10 hover:bg-white/8"
                  )}
                >
                  <Icon size={22} className={theme === t.id ? "text-accent" : ""} />
                  <span className="text-sm">{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Wallpaper */}
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <ImageIcon size={18} /> Wallpaper
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                onClick={() => setWallpaper(w.id)}
                className={cn(
                  "group relative aspect-video overflow-hidden rounded-lg ring-2 transition",
                  !customWallpaper && wallpaperId === w.id
                    ? "ring-accent"
                    : "ring-transparent hover:ring-white/30"
                )}
                style={{ background: w.value }}
                title={w.name}
              >
                {!customWallpaper && wallpaperId === w.id && (
                  <span className="absolute bottom-1 right-1 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-medium text-white">
                    Active
                  </span>
                )}
              </button>
            ))}

            {/* user uploads */}
            {custom.map((w) => {
              const value = `url("${w.dataUrl}")`;
              return (
                <button
                  key={w.id}
                  onClick={() => setCustomWallpaper(value)}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-lg bg-cover bg-center ring-2 transition",
                    customWallpaper === value ? "ring-accent" : "ring-transparent hover:ring-white/30"
                  )}
                  style={{ backgroundImage: `url("${w.dataUrl}")` }}
                  title={w.name}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustom(w.id, w.dataUrl);
                    }}
                    className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
                  >
                    <Trash2 size={11} />
                  </span>
                </button>
              );
            })}

            {/* upload tile */}
            <button
              onClick={() => fileRef.current?.click()}
              className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-white/20 text-os-muted transition hover:border-accent hover:text-accent"
            >
              <Upload size={18} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
          </div>
          <p className="mt-2 text-xs text-os-muted">
            Uploaded wallpapers are stored only on your device (IndexedDB) — they
            never reach the server.
          </p>
        </section>

        {/* Accessibility */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Sparkles size={18} /> Accessibility
          </h2>
          <label className="flex items-center justify-between rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div>
              <div className="text-sm font-medium">Reduce motion</div>
              <div className="text-xs text-os-muted">
                Minimize window open/close animations
              </div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={cn(
                "relative h-6 w-11 rounded-full transition",
                reducedMotion ? "bg-accent" : "bg-white/20"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                  reducedMotion ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </label>
        </section>

        <div className="mt-8 flex items-center gap-2 text-xs text-os-muted">
          <Monitor size={13} /> Ishan OS · v1.0 · built with Next.js
        </div>
      </div>
    </div>
  );
}
