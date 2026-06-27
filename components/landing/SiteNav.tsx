"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Moon, Sun, PenLine, Menu, X } from "lucide-react";
import { NavWave } from "./NavWave";
import { useTheme } from "@/components/theme/ThemeProvider";

/**
 * Wave navbar for the crawlable /(site) pages — matches the landing navbar
 * (scalloped wave edge, theme toggle, Boot OS). Collapses to a hamburger on
 * small screens. "Blog" goes to the blog list; a Write button sits beside the
 * theme toggle.
 */
const LINKS: [string, string][] = [
  ["About", "/#about"],
  ["Experience", "/#experience"],
  ["Projects", "/#projects"],
  ["Blog", "/blog"],
  ["Contact", "/#contact"],
];

export function SiteNav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative">
        <div className="bg-[var(--glass-bg-strong)] backdrop-blur-xl">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5">
            <Link href="/" className="flex items-center gap-2.5 font-display text-base font-semibold">
              <Image
                src="/brand/is-logo-mark.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
              Ishan Savaliya
            </Link>
            <div className="hidden items-center gap-7 text-sm text-os-muted md:flex">
              {LINKS.map(([label, href]) => (
                <Link key={href} href={href} className="transition-colors hover:text-os-fg">
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border text-os-fg/80 transition hover:text-os-fg"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link
                href="/write"
                className="hidden items-center gap-1.5 rounded-full border border-glass-border px-3.5 py-2 text-sm font-medium text-os-fg/85 transition hover:border-accent hover:text-os-fg sm:flex"
              >
                <PenLine size={14} /> Write
              </Link>
              <Link
                href="/os"
                className="hidden items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:flex"
              >
                Boot Ishan OS <ArrowUpRight size={15} />
              </Link>
              {/* hamburger — mobile only */}
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border text-os-fg/80 transition hover:text-os-fg md:hidden"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>

          {/* mobile dropdown */}
          {open && (
            <div className="border-t border-glass-border px-6 pb-4 pt-2 md:hidden">
              <div className="flex flex-col">
                {LINKS.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="border-b border-glass-border/60 py-3 text-sm text-os-fg/85 transition hover:text-os-fg"
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-4 flex gap-2">
                  <Link
                    href="/write"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-glass-border px-4 py-2.5 text-sm font-medium"
                  >
                    <PenLine size={14} /> Write
                  </Link>
                  <Link
                    href="/os"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Boot OS <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        {!open && <NavWave className="drop-shadow-[0_6px_8px_rgba(0,0,0,0.18)]" />}
      </div>
    </header>
  );
}
