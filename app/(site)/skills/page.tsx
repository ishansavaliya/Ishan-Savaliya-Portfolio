import type { Metadata } from "next";
import { getContentFromDb } from "@/lib/content/server";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Skills & Tech Stack — Ishan Savaliya",
  description:
    "Ishan Savaliya's technical skills: React, Next.js, TypeScript, Java, Spring Boot, Node.js, PostgreSQL, MongoDB, Docker, AWS, and more.",
  alternates: { canonical: "/skills" },
};

export default async function SkillsPage() {
  const c = await getContentFromDb();
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Skills", url: "/skills" },
        ])}
      />
      <h1 className="text-3xl font-bold tracking-tight">Skills & Tech Stack</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {c.skills.map((cat) => (
          <section key={cat.id}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-os-muted">
              {cat.label}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {cat.skills.map((s) => (
                <li
                  key={s.name}
                  className="rounded-md bg-white/8 px-2.5 py-1 text-sm ring-1 ring-white/10"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
