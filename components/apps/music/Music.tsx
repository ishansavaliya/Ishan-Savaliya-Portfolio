"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music2,
} from "lucide-react";
import { useMusicStore, fmtTime } from "@/lib/store/useMusicStore";
import { cn } from "@/lib/utils";

export function Music() {
  const {
    tracks,
    currentIndex,
    playing,
    progress,
    currentTime,
    duration,
    volume,
    play,
    toggle,
    next,
    prev,
    seek,
    setVolume,
  } = useMusicStore();
  const track = tracks[currentIndex];

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#1f1235] to-[#0c0c12] text-white">
      <div className="flex min-h-0 flex-1">
        {/* Library */}
        <aside className="w-56 shrink-0 border-r border-white/8 bg-black/30 p-3">
          <div className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold">
            <Music2 size={16} className="text-[#1ed760]" /> Your Library
          </div>
          <div className="space-y-0.5">
            {["Coding Mix", "Chill Lo-fi", "Focus", "Favourites"].map((p) => (
              <div
                key={p}
                className="rounded-md px-3 py-1.5 text-[13px] text-white/70 hover:bg-white/5"
              >
                {p}
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="os-scroll flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-end gap-5">
            <div
              className="h-40 w-40 shrink-0 rounded-xl shadow-2xl"
              style={{ background: track?.cover }}
            />
            <div>
              <div className="text-xs uppercase tracking-wide text-white/60">
                Playlist
              </div>
              <h1 className="text-3xl font-bold">Coding Mix</h1>
              <p className="mt-1 text-sm text-white/60">
                {tracks.length} tracks · for deep work
              </p>
              <button
                onClick={() => toggle()}
                className="mt-3 flex items-center gap-2 rounded-full bg-[#1ed760] px-5 py-2 text-sm font-semibold text-black transition hover:scale-105"
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
                {playing ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          {/* track list */}
          <div className="space-y-1">
            {tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => play(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/8",
                  i === currentIndex && "bg-white/10"
                )}
              >
                <span className="w-5 text-center text-sm text-white/50">
                  {i === currentIndex && playing ? (
                    <span className="text-[#1ed760]">♪</span>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className="h-10 w-10 shrink-0 rounded"
                  style={{ background: t.cover }}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm font-medium",
                      i === currentIndex && "text-[#1ed760]"
                    )}
                  >
                    {t.title}
                  </span>
                  <span className="block truncate text-xs text-white/50">
                    {t.artist}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Now-playing bar */}
      <div className="flex h-20 shrink-0 items-center gap-4 border-t border-white/10 bg-black/40 px-4">
        <div className="flex w-48 items-center gap-3">
          <span
            className="h-12 w-12 shrink-0 rounded"
            style={{ background: track?.cover }}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{track?.title}</div>
            <div className="truncate text-xs text-white/50">{track?.artist}</div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button onClick={prev} className="text-white/70 hover:text-white">
              <SkipBack size={18} />
            </button>
            <button
              onClick={() => toggle()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
            >
              {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={next} className="text-white/70 hover:text-white">
              <SkipForward size={18} />
            </button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 text-[11px] text-white/50">
            <span className="tabular-nums">{fmtTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer accent-[#1ed760]"
            />
            <span className="tabular-nums">{fmtTime(duration)}</span>
          </div>
        </div>

        <div className="flex w-48 items-center justify-end gap-2">
          <Volume2 size={16} className="text-white/60" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-24 cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
}
