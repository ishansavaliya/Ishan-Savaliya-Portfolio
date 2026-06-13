import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd, websiteJsonLd, personJsonLd } from "@/lib/seo";

/**
 * Crawlable HTML site that lives alongside the OS homepage. These pages give
 * search engines real, indexable content (the OS UI itself is canvas-like).
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="os-scroll fixed inset-0 overflow-y-auto bg-os-bg text-os-fg">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <header className="sticky top-0 z-10 border-b border-white/10 bg-os-bg/80 backdrop-blur">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 text-sm">
          <Link href="/" className="font-semibold tracking-tight">
            Ishan Savaliya
          </Link>
          <div className="flex items-center gap-4 text-os-muted">
            <Link href="/about" className="hover:text-os-fg">About</Link>
            <Link href="/projects" className="hover:text-os-fg">Projects</Link>
            <Link href="/experience" className="hover:text-os-fg">Experience</Link>
            <Link href="/blog" className="hover:text-os-fg">Blog</Link>
            <Link href="/contact" className="hover:text-os-fg">Contact</Link>
            <Link
              href="/"
              className="rounded-full bg-accent px-3 py-1 font-medium text-white"
            >
              Launch OS
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-10">{children}</main>
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-os-muted">
        © {2026} Ishan Savaliya · Full-Stack Developer · Surat, Gujarat, India ·{" "}
        <Link href="/" className="hover:text-os-fg">
          Explore the OS portfolio
        </Link>
      </footer>
    </div>
  );
}
