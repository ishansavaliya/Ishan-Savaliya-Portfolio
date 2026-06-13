"use client";

import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { WindowInstance } from "@/types/os";
import { getApp } from "@/lib/apps/registry";
import { useWindowStore, TOP_BAR_HEIGHT } from "@/lib/store/useWindowStore";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { TrafficLights } from "./TrafficLights";

export function Window({ win }: { win: WindowInstance }) {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
  } = useWindowStore();
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const [closing, setClosing] = useState(false);

  function handleClose() {
    if (reducedMotion) return closeWindow(win.id);
    setClosing(true);
    setTimeout(() => closeWindow(win.id), 200);
  }

  const def = getApp(win.appId);
  const Body = def?.component;
  const resizable = def?.resizable ?? true;
  const min = def?.minSize ?? { width: 360, height: 240 };

  const enableResizing = useMemo(
    () =>
      resizable && !win.maximized
        ? {
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }
        : false,
    [resizable, win.maximized]
  );

  if (!Body) return null;

  // Genie target: vector from the window center toward the dock (bottom-center).
  const minimizeAnim = (() => {
    if (typeof window === "undefined") return { opacity: 0, scale: 0.2, y: 600 };
    const cx = win.x + win.width / 2;
    const dockX = window.innerWidth / 2;
    const dockY = window.innerHeight - 40;
    return {
      opacity: 0,
      scale: 0.15,
      x: dockX - cx,
      y: dockY - (win.y + win.height / 2),
      transformOrigin: "bottom center",
    };
  })();

  return (
    <Rnd
      size={{ width: win.width, height: win.height }}
      position={{ x: win.x, y: win.y }}
      bounds="parent"
      minWidth={min.width}
      minHeight={min.height}
      dragHandleClassName="os-window-titlebar"
      enableResizing={win.minimized ? false : enableResizing}
      disableDragging={win.maximized || win.minimized}
      style={{ zIndex: win.z, pointerEvents: win.minimized ? "none" : "auto" }}
      onMouseDown={() => focusWindow(win.id)}
      onDragStart={() => focusWindow(win.id)}
      onDragStop={(_e, d) => moveWindow(win.id, d.x, d.y)}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        resizeWindow(win.id, {
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          x: pos.x,
          y: pos.y,
        })
      }
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={
          closing
            ? { opacity: 0, scale: 0.92 }
            : win.minimized
              ? reducedMotion
                ? { opacity: 0 }
                : minimizeAnim
              : { opacity: 1, scale: 1, x: 0, y: 0 }
        }
        transition={{
          duration: closing ? 0.18 : 0.28,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="liquid-glass flex h-full w-full flex-col overflow-hidden"
        style={{
          borderRadius: win.maximized ? 0 : "var(--radius-window)",
        }}
      >
        {/* Title bar */}
        <div
          className="os-window-titlebar relative flex h-10 shrink-0 items-center border-b border-white/8 bg-white/[0.03] px-3.5"
          onDoubleClick={() => toggleMaximize(win.id)}
        >
          <TrafficLights
            onClose={handleClose}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
          />
          <div className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-os-fg/90">
            {win.title}
          </div>
        </div>

        {/* Body */}
        <div className="os-scroll relative min-h-0 flex-1 overflow-hidden">
          <Body />
        </div>
      </motion.div>
    </Rnd>
  );
}

export { TOP_BAR_HEIGHT };
