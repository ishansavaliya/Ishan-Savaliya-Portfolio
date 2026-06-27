import type { Metadata } from "next";
import Link from "next/link";
import { getContentFromDb } from "@/lib/content/server";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects — Ishan Savaliya | Full-Stack & AI Projects",
  description:
    "Projects by Ishan Savaliya: InterviewReady, Wire2Web, JobVerse, Farmzy, and more — built with React, Next.js, Spring Boot, PostgreSQL and AI APIs.",
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    title: "Projects — Ishan Savaliya",
    description: "Production apps, freelance client work, and AI/ML projects.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Ishan Savaliya",
    description: "Production apps, freelance client work, and AI/ML projects.",
  },
};

export default async function ProjectsPage() {
  const c = await getContentFromDb();
  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          "Projects by Ishan Savaliya",
          c.projects.map((p) => ({ name: p.name, url: `/projects/${p.id}` }))
        )}
      />
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 text-os-muted">
        Production apps, freelance client work, and AI/ML projects.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {c.projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="block rounded-xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/8"
          >
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-accent-pink">{p.tagline}</p>
            <p className="mt-2 line-clamp-3 text-sm text-os-fg/75">
              {p.description}
            </p>
            <p className="mt-3 text-xs text-os-muted">{p.stack.join(" · ")}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
