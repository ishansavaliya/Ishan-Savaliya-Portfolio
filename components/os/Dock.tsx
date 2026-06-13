"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { dockApps } from "@/lib/apps/registry";
import { useWindowStore } from "@/lib/store/useWindowStore";
import { AppGlyph } from "./icons";
import type { AppId } from "@/types/os";

const BASE = 50;
const MAX = 80;
const DISTANCE = 130; // px of influence on each side

export function Dock() {
  const apps = dockApps();
  const openApp = useWindowStore((s) => s.openApp);
  const windows = useWindowStore((s) => s.windows);
  const running = new Set(windows.map((w) => w.appId as AppId));

  const mouseX = useMotionValue(Infinity);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2.5 z-[8000] flex justify-center">
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="liquid-glass pointer-events-auto flex h-[68px] items-end gap-2.5 rounded-[26px] px-3 pb-2.5"
      >
        {apps.map((app) => (
          <DockItem
            key={app.id}
            appId={app.id}
            label={app.title}
            running={running.has(app.id)}
            mouseX={mouseX}
            onClick={() => openApp(app.id)}
            divider={app.id === "launchpad"}
          />
        ))}
      </div>
    </div>
  );
}

function DockItem({
  appId,
  label,
  running,
  mouseX,
  onClick,
  divider,
}: {
  appId: AppId;
  label: string;
  running: boolean;
  mouseX: MotionValue<number>;
  onClick: () => void;
  divider?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // Distance from cursor to this item's center.
  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: BASE,
    };
    return x - bounds.x - bounds.width / 2;
  });

  const sizeRaw = useTransform(
    distance,
    [-DISTANCE, 0, DISTANCE],
    [BASE, MAX, BASE]
  );
  const size = useSpring(sizeRaw, {
    mass: 0.1,
    stiffness: 200,
    damping: 14,
  });

  return (
    <div className="flex items-end">
      <motion.button
        ref={ref}
        style={{ width: size, height: size }}
        onClick={onClick}
        className="group relative flex flex-col items-center"
        aria-label={label}
      >
        <span className="pointer-events-none absolute -top-11 hidden whitespace-nowrap rounded-lg bg-[var(--glass-bg-strong)] px-2.5 py-1 text-[13px] font-medium text-os-fg backdrop-blur group-hover:block">
          {label}
        </span>
        <AppGlyph appId={appId} size="full" />
      </motion.button>
      {running && (
        <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-os-fg/80" />
      )}
      {divider && (
        <span className="mx-1 mb-2 h-11 w-px self-center bg-white/15" />
      )}
    </div>
  );
}
