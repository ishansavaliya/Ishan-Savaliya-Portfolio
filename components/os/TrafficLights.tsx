"use client";

import { useState } from "react";
import { X, Minus, Maximize2 } from "lucide-react";

/** macOS-style red/yellow/green window controls with hover glyphs. */
export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  const [hover, setHover] = useState(false);

  const dot =
    "group flex h-3 w-3 items-center justify-center rounded-full transition-colors";

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        aria-label="Close window"
        className={`${dot} bg-[#ff5f57] hover:bg-[#ff5f57]`}
        onClick={onClose}
      >
        <X
          size={8}
          strokeWidth={3}
          className={`text-black/60 transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}
        />
      </button>
      <button
        aria-label="Minimize window"
        className={`${dot} bg-[#ffbd2e]`}
        onClick={onMinimize}
      >
        <Minus
          size={8}
          strokeWidth={3}
          className={`text-black/60 transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}
        />
      </button>
      <button
        aria-label="Maximize window"
        className={`${dot} bg-[#28c840]`}
        onClick={onMaximize}
      >
        <Maximize2
          size={7}
          strokeWidth={3}
          className={`text-black/60 transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}
        />
      </button>
    </div>
  );
}
