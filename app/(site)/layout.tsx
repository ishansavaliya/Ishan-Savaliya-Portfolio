import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd, websiteJsonLd, personJsonLd } from "@/lib/seo";
import { SiteNav } from "@/components/landing/SiteNav";
import { GitHub, Linkedin2 } from "@/components/os/icons/brand";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

/**
 * Crawlable HTML site that lives alongside the OS homepage. These pages give
 * search engines real, indexable content. Uses the same wave navbar + footer
 * styling as the landing page so the whole site feels unified.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
    <div className="landing-scroll landing-bg grain os-scroll text-os-fg">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <SiteNav />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-10">{children}</main>

      <footer className="border-t border-white/10 px-5 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center text-sm text-os-muted">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ishansavaliya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition hover:text-os-fg"
            >
              <GitHub size={20} />
            </a>
            <a
              href="https://linkedin.com/in/iamishansavaliya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition hover:text-os-fg"
            >
              <Linkedin2 size={20} />
            </a>
          </div>
          <p>
            © {2026} Ishan Savaliya · Full-Stack Developer · Surat, Gujarat,
            India
          </p>
          <Link href="/os" className="text-accent hover:underline">
            Explore the interactive Ishan OS →
          </Link>
        </div>
      </footer>
    </div>
    </ThemeProvider>
  );
}
