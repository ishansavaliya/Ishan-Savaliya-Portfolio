"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";

export interface Wallpaper {
  id: string;
  name: string;
  /** CSS background value (gradient or url()). */
  value: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "sonoma-dusk",
    name: "Sonoma Dusk",
    value:
      "radial-gradient(120% 120% at 70% 20%, #3a2b6b 0%, #1b1d4e 40%, #0a0c1f 100%)",
  },
  {
    id: "ventura",
    name: "Ventura",
    value:
      "linear-gradient(160deg, #ff7e5f 0%, #b5468f 45%, #4b2a8a 80%, #1a1340 100%)",
  },
  {
    id: "monterey",
    name: "Monterey",
    value:
      "radial-gradient(130% 130% at 30% 0%, #2dd4bf 0%, #2f6df6 45%, #4b2a8a 100%)",
  },
  {
    id: "graphite",
    name: "Graphite",
    value:
      "linear-gradient(160deg, #2b2f3a 0%, #15171c 60%, #0a0b10 100%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    value:
      "radial-gradient(120% 120% at 80% 10%, #00e0a4 0%, #1b6ef3 40%, #6b1bf3 75%, #120a2e 100%)",
  },
];

interface SettingsState {
  theme: Theme;
  wallpaperId: string;
  /** A CSS background value for a user-uploaded wallpaper (IndexedDB-backed). */
  customWallpaper: string | null;
  reducedMotion: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setWallpaper: (id: string) => void;
  setCustomWallpaper: (value: string | null) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      wallpaperId: "sonoma-dusk",
      customWallpaper: null,
      reducedMotion: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setWallpaper: (wallpaperId) => set({ wallpaperId, customWallpaper: null }),
      setCustomWallpaper: (customWallpaper) => set({ customWallpaper }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    { name: "ishan-os-settings" }
  )
);

export function getWallpaper(id: string): Wallpaper {
  return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
}

/** Resolve the active background CSS value (custom upload wins over presets). */
export function resolveWallpaper(
  wallpaperId: string,
  customWallpaper: string | null
): string {
  if (customWallpaper) return customWallpaper;
  return getWallpaper(wallpaperId).value;
}
