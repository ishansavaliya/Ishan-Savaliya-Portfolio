"use client";

import { create } from "zustand";
import { TRACKS, type Track } from "@/components/apps/music/tracks";

interface MusicState {
  tracks: Track[];
  currentIndex: number;
  playing: boolean;
  progress: number; // 0..1
  currentTime: number;
  duration: number;
  volume: number;
  play: (index?: number) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (fraction: number) => void;
  setVolume: (v: number) => void;
  /** Internal: updated by the audio element. */
  _setTime: (t: number, d: number) => void;
  _wantSeek: number | null;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  tracks: TRACKS,
  currentIndex: 0,
  playing: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  _wantSeek: null,

  play: (index) =>
    set((s) => ({
      currentIndex: index ?? s.currentIndex,
      playing: true,
    })),
  pause: () => set({ playing: false }),
  toggle: () => set((s) => ({ playing: !s.playing })),
  next: () =>
    set((s) => ({
      currentIndex: (s.currentIndex + 1) % s.tracks.length,
      playing: true,
    })),
  prev: () =>
    set((s) => ({
      currentIndex: (s.currentIndex - 1 + s.tracks.length) % s.tracks.length,
      playing: true,
    })),
  seek: (fraction) => {
    const { duration } = get();
    set({ _wantSeek: fraction * duration });
  },
  setVolume: (volume) => set({ volume }),
  _setTime: (currentTime, duration) =>
    set({
      currentTime,
      duration,
      progress: duration ? currentTime / duration : 0,
      _wantSeek: null,
    }),
}));

export function fmtTime(s: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
