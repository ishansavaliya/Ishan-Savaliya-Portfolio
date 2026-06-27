"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, ArrowUpRight, Menu, X } from "lucide-react";
import { NavWave } from "./NavWave";

/**
 * Full-width navbar with a wave bottom edge (SVG mask) — not a capsule.
 * Collapses to a hamburger menu on small screens.
 */
export function Navbar({
  theme,
  onToggle,
}: {
  theme: "dark" | "light";
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const links = [
    ["About", "#about"],
    ["Experience", "#experience"],
    ["Projects", "#projects"],
    ["Freelance", "#freelance"],
    ["Blog", "#blog"],
    ["Contact", "#contact"],
  ];
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative">
        <div className="bg-[var(--glass-bg-strong)] backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
            <a href="#top" className="flex items-center gap-2.5 font-display text-base font-semibold">
              <Image
                src="/brand/is-logo-mark.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
              Ishan Savaliya
            </a>
            <div className="hidden items-center gap-7 text-sm text-os-muted lg:flex">
              {links.map(([label, href]) => (
                <a key={href} href={href} className="relative transition-colors hover:text-os-fg">
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggle}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border text-os-fg/80 transition hover:text-os-fg"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link
                href="/os"
                className="hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:flex"
              >
                Boot Ishan OS <ArrowUpRight size={15} />
              </Link>
              {/* hamburger — mobile / tablet only */}
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border text-os-fg/80 transition hover:text-os-fg lg:hidden"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>

          {/* mobile dropdown */}
          {open && (
            <div className="border-t border-glass-border px-6 pb-4 pt-2 lg:hidden">
              <div className="flex flex-col">
                {links.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="border-b border-glass-border/60 py-3 text-sm text-os-fg/85 transition hover:text-os-fg"
                  >
                    {label}
                  </a>
                ))}
                <Link
                  href="/os"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white"
                >
                  Boot Ishan OS <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* wave bottom edge — many tiny scallops, no flat line */}
        {!open && <NavWave className="drop-shadow-[0_6px_8px_rgba(0,0,0,0.18)]" />}
      </div>
    </header>
  );
}
