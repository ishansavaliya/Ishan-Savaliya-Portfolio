"use client";

import { create } from "zustand";
import type { AppId, WindowInstance } from "@/types/os";
import { getApp } from "@/lib/apps/registry";

const TOP_BAR_HEIGHT = 28;
const DOCK_RESERVE = 96;

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `win-${idCounter}`;
}

interface WindowState {
  windows: WindowInstance[];
  topZ: number;
  /** Open an app: focuses an existing window, or creates a new one. */
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (
    id: string,
    geom: { x: number; y: number; width: number; height: number }
  ) => void;
}

let openCounter = 0;

/** Cascade new windows down-right from a centered start so none bury each other. */
function cascadePosition(width: number, height: number) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const step = openCounter % 7;
  openCounter += 1;
  const baseX = Math.max(40, (vw - width) / 2 - 120);
  const baseY = Math.max(TOP_BAR_HEIGHT + 20, (vh - height) / 2 - 80);
  const x = Math.min(baseX + step * 40, vw - width - 20);
  const y = Math.min(baseY + step * 36, vh - height - 110);
  return { x: Math.max(20, x), y: Math.max(TOP_BAR_HEIGHT + 8, y) };
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  topZ: 1,

  openApp: (appId) => {
    const { windows, topZ } = get();
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      // Un-minimize and bring to front.
      const z = topZ + 1;
      set({
        topZ: z,
        windows: windows.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, z } : w
        ),
      });
      return;
    }

    const def = getApp(appId);
    if (!def) return;

    const { width, height } = def.defaultSize;
    const { x, y } = cascadePosition(width, height);
    const z = topZ + 1;

    set({
      topZ: z,
      windows: [
        ...windows,
        {
          id: nextId(),
          appId,
          title: def.title,
          x,
          y,
          width,
          height,
          z,
          minimized: false,
          maximized: false,
        },
      ],
    });
  },

  closeWindow: (id) =>
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) =>
    set((s) => {
      const z = s.topZ + 1;
      return {
        topZ: z,
        windows: s.windows.map((w) => (w.id === id ? { ...w, z } : w)),
      };
    }),

  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    })),

  restoreWindow: (id) =>
    set((s) => {
      const z = s.topZ + 1;
      return {
        topZ: z,
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, z } : w
        ),
      };
    }),

  toggleMaximize: (id) =>
    set((s) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        windows: s.windows.map((w) => {
          if (w.id !== id) return w;
          if (w.maximized && w.prevGeometry) {
            return { ...w, maximized: false, ...w.prevGeometry };
          }
          return {
            ...w,
            maximized: true,
            prevGeometry: {
              x: w.x,
              y: w.y,
              width: w.width,
              height: w.height,
            },
            x: 0,
            y: TOP_BAR_HEIGHT,
            width: vw,
            height: vh - TOP_BAR_HEIGHT - DOCK_RESERVE,
          };
        }),
      };
    }),

  moveWindow: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resizeWindow: (id, geom) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...geom } : w)),
    })),
}));

export { TOP_BAR_HEIGHT, DOCK_RESERVE };
