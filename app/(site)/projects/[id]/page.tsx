import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentFromDb } from "@/lib/content/server";
import { SEED } from "@/lib/content/seed";
import { JsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return SEED.projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = SEED.projects.find((x) => x.id === id);
  if (!p) return { title: "Project not found" };
  return {
    title: `${p.name} — ${p.tagline} | Ishan Savaliya`,
    description: p.description,
    keywords: p.stack,
    alternates: { canonical: `/projects/${p.id}` },
    openGraph: { title: p.name, description: p.description, type: "article" },
    twitter: {
      card: "summary_large_image",
      title: p.name,
      description: p.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getContentFromDb();
  const p = c.projects.find((x) => x.id === id);
  if (!p) notFound();

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    headline: `${p.name} — ${p.tagline}`,
    description: p.description,
    url: `${SITE_URL}/projects/${p.id}`,
    keywords: p.stack.join(", "),
    author: { "@type": "Person", name: "Ishan Savaliya", url: SITE_URL },
    ...(p.live ? { sameAs: p.live } : {}),
    ...(p.github ? { codeRepository: p.github } : {}),
  };

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={creativeWork} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
          { name: p.name, url: `/projects/${p.id}` },
        ])}
      />
      <Link href="/projects" className="text-sm text-accent hover:underline">
        ← All projects
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{p.name}</h1>
      <p className="mt-1 text-accent-pink">{p.tagline}</p>
      <p className="mt-4 text-[17px] leading-relaxed text-os-fg/85">
        {p.description}
      </p>

      <h2 className="mt-8 text-xl font-semibold">Highlights</h2>
      <ul className="mt-3 space-y-1.5">
        {p.highlights.map((h, i) => (
          <li key={i} className="flex gap-2 text-os-fg/85">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {h}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Tech stack</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <li
            key={s}
            className="rounded-md bg-white/8 px-2.5 py-1 text-sm ring-1 ring-white/10"
          >
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex gap-4">
        {p.github && (
          <a href={p.github} className="text-accent hover:underline" rel="noopener">
            View on GitHub →
          </a>
        )}
        {p.live && (
          <a href={p.live} className="text-accent hover:underline" rel="noopener">
            Live project →
          </a>
        )}
      </div>
    </article>
  );
}
