"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getWallpaper, useSettingsStore } from "@/lib/store/useSettingsStore";

/** Login screen — click avatar / press Enter to enter the desktop. */
export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const wallpaperId = useSettingsStore((s) => s.wallpaperId);
  const wallpaper = getWallpaper(wallpaperId);
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") onLogin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLogin]);

  return (
    <motion.div
      className="fixed inset-0 z-[9800] flex flex-col items-center justify-center"
      style={{ background: wallpaper.value }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 backdrop-blur-2xl" />
      <div className="relative flex flex-col items-center text-white">
        <div className="mb-2 text-7xl font-thin tabular-nums">
          {time
            ? time.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--"}
        </div>
        <div className="mb-16 text-lg font-medium opacity-90">
          {time
            ? time.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
            : ""}
        </div>

        <button onClick={onLogin} className="group flex flex-col items-center">
          <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-2 ring-white/40 backdrop-blur transition group-hover:ring-white/70">
            <Image
              src="/brand/is-logo.png"
              alt="Ishan Savaliya"
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
              priority
            />
          </span>
          <span className="mt-3 text-lg font-medium">Ishan Savaliya</span>
          <span className="mt-2 flex items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-sm opacity-80 transition group-hover:opacity-100">
            Click to log in <ChevronRight size={16} />
          </span>
        </button>
      </div>
    </motion.div>
  );
}
