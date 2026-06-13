"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "@/lib/store/useMusicStore";

/**
 * Single hidden <audio> element that lives at the OS level, so music keeps
 * playing even when the Music window is closed (background playback).
 */
export function AudioEngine() {
  const ref = useRef<HTMLAudioElement>(null);
  const { tracks, currentIndex, playing, volume, _wantSeek, _setTime, next } =
    useMusicStore();
  const track = tracks[currentIndex];

  // Play / pause.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing, currentIndex]);

  // Volume.
  useEffect(() => {
    if (ref.current) ref.current.volume = volume;
  }, [volume]);

  // Seek requests from the store.
  useEffect(() => {
    if (_wantSeek != null && ref.current) {
      ref.current.currentTime = _wantSeek;
    }
  }, [_wantSeek]);

  return (
    <audio
      ref={ref}
      src={track?.src}
      onTimeUpdate={(e) =>
        _setTime(e.currentTarget.currentTime, e.currentTarget.duration || 0)
      }
      onLoadedMetadata={(e) =>
        _setTime(e.currentTarget.currentTime, e.currentTarget.duration || 0)
      }
      onEnded={() => next()}
      preload="metadata"
    />
  );
}
