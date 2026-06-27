"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wifi, Search, BatteryMedium, Sliders, Monitor } from "lucide-react";
import { useWindowStore } from "@/lib/store/useWindowStore";
import { getApp } from "@/lib/apps/registry";
import { cn } from "@/lib/utils";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

interface MenuItem {
  label: string;
  shortcut?: string;
  separator?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function TopBar({ onSpotlight }: { onSpotlight: () => void }) {
  const now = useClock();
  const windows = useWindowStore((s) => s.windows);
  const { openApp, closeWindow, minimizeWindow, toggleMaximize } =
    useWindowStore();

  const active = [...windows]
    .filter((w) => !w.minimized)
    .sort((a, b) => b.z - a.z)[0];
  const activeApp = active ? getApp(active.appId) : undefined;
  const activeTitle = activeApp?.title ?? "Finder";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  const menus: Record<string, MenuItem[]> = {
    logo: [
      { label: "About This Portfolio", onClick: () => openApp("finder") },
      { label: "", separator: true },
      { label: "System Settings…", onClick: () => openApp("settings") },
      { label: "Launchpad", onClick: () => openApp("launchpad") },
      { label: "", separator: true },
      {
        label: "Contact Ishan",
        onClick: () => openApp("contact"),
      },
      { label: "", separator: true },
      {
        label: "Exit to Classic Portfolio",
        onClick: () => {
          window.location.href = "/";
        },
      },
    ],
    app: [
      { label: `About ${activeTitle}`, disabled: !active },
      { label: "", separator: true },
      {
        label: "Hide",
        shortcut: "⌘H",
        disabled: !active,
        onClick: () => active && minimizeWindow(active.id),
      },
      {
        label: "Enter Full Screen",
        shortcut: "⌃⌘F",
        disabled: !active,
        onClick: () => active && toggleMaximize(active.id),
      },
      { label: "", separator: true },
      {
        label: `Close ${activeTitle}`,
        shortcut: "⌘W",
        disabled: !active,
        onClick: () => active && closeWindow(active.id),
      },
    ],
    File: [
      { label: "New Window", shortcut: "⌘N", onClick: () => openApp("finder") },
      { label: "Open Terminal", onClick: () => openApp("terminal") },
      { label: "", separator: true },
      {
        label: "Close Window",
        shortcut: "⌘W",
        disabled: !active,
        onClick: () => active && closeWindow(active.id),
      },
    ],
    Edit: [
      { label: "Undo", shortcut: "⌘Z", disabled: true },
      { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
      { label: "", separator: true },
      { label: "Cut", shortcut: "⌘X", disabled: true },
      { label: "Copy", shortcut: "⌘C", disabled: true },
      { label: "Paste", shortcut: "⌘V", disabled: true },
    ],
    View: [
      {
        label: active?.maximized ? "Exit Full Screen" : "Enter Full Screen",
        shortcut: "⌃⌘F",
        disabled: !active,
        onClick: () => active && toggleMaximize(active.id),
      },
      { label: "", separator: true },
      { label: "Spotlight…", shortcut: "⌘Space", onClick: onSpotlight },
    ],
    Window: [
      {
        label: "Minimize",
        shortcut: "⌘M",
        disabled: !active,
        onClick: () => active && minimizeWindow(active.id),
      },
      {
        label: "Zoom",
        disabled: !active,
        onClick: () => active && toggleMaximize(active.id),
      },
    ],
    Help: [{ label: "Ask Ishan AI", onClick: () => openApp("ai-assistant") }],
  };

  const date = now
    ? now.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "";
  const time = now
    ? now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "";

  function MenuButton({
    id,
    label,
    bold,
    isLogo,
  }: {
    id: string;
    label?: string;
    bold?: boolean;
    isLogo?: boolean;
  }) {
    const open = openMenu === id;
    return (
      <div className="relative">
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            setOpenMenu(open ? null : id);
          }}
          onMouseEnter={() => openMenu && setOpenMenu(id)}
          className={cn(
            "flex h-8 items-center rounded px-2.5 text-[14px] leading-none transition-colors",
            open ? "bg-white/15" : "hover:bg-white/10",
            bold && "font-semibold"
          )}
        >
          {isLogo ? (
            <span className="flex h-[18px] w-[18px] items-center justify-center overflow-hidden rounded-full">
              <Image
                src="/brand/is-logo-mark.png"
                alt="Ishan OS"
                width={18}
                height={18}
                className="h-[18px] w-[18px] object-cover"
                priority
              />
            </span>
          ) : (
            label
          )}
        </button>
        {open && (
          <div className="glass-strong absolute left-0 top-9 z-[9100] min-w-56 rounded-lg py-1 text-[13px] shadow-2xl">
            {menus[id]?.map((item, i) =>
              item.separator ? (
                <div key={i} className="my-1 h-px bg-white/10" />
              ) : (
                <button
                  key={i}
                  disabled={item.disabled}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                    setOpenMenu(null);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-8 px-3 py-1.5 text-left",
                    item.disabled
                      ? "text-os-muted/50"
                      : "hover:bg-accent hover:text-white"
                  )}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="text-os-muted">{item.shortcut}</span>
                  )}
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={barRef}
      className="liquid-glass fixed inset-x-0 top-0 z-[9000] flex h-8 items-center justify-between px-2 text-[14px] font-medium text-os-fg"
      style={{ borderRadius: 0, borderWidth: "0 0 0.5px 0" }}
    >
      <div className="flex items-center gap-0.5">
        <MenuButton id="logo" isLogo />
        <MenuButton id="app" label={activeTitle} bold />
        <MenuButton id="File" label="File" />
        <MenuButton id="Edit" label="Edit" />
        <span className="hidden md:contents">
          <MenuButton id="View" label="View" />
          <MenuButton id="Window" label="Window" />
          <MenuButton id="Help" label="Help" />
        </span>
      </div>

      <div className="flex items-center gap-3.5 pr-1.5">
        <Link
          href="/"
          title="Back to the classic portfolio"
          className="flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[12px] font-medium leading-none transition hover:bg-white/20"
        >
          <Monitor size={13} />
          <span className="hidden sm:inline">Classic</span>
        </Link>
        <BatteryMedium size={18} />
        <Wifi size={15} />
        <button
          aria-label="Spotlight search"
          onClick={onSpotlight}
          className="transition-opacity hover:opacity-70"
        >
          <Search size={14} />
        </button>
        <Sliders size={14} />
        <span className="tabular-nums">{date}</span>
        <span className="tabular-nums">{time}</span>
      </div>
    </div>
  );
}
