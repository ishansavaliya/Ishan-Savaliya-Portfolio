import type { Metadata } from "next";
import { getContentFromDb } from "@/lib/content/server";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Experience — Ishan Savaliya | Full-Stack Developer",
  description:
    "Ishan Savaliya's work experience: Full-Stack Developer Intern at EMGAGE (React, Spring Boot, AWS, CI/CD), MERN Stack Intern at Brainybeam, and more.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const c = await getContentFromDb();
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Experience", url: "/experience" },
        ])}
      />
      <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
      <p className="mt-2 text-os-muted">
        Production full-stack work across React, Next.js, Spring Boot and the
        MERN stack.
      </p>
      <div className="mt-8 space-y-8">
        {c.experience.map((e) => (
          <section key={e.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">
                {e.role} · {e.company}
              </h2>
              <span className="text-sm text-os-muted">
                {e.start} – {e.end}
              </span>
            </div>
            <p className="text-sm text-os-muted">{e.location}</p>
            <ul className="mt-3 space-y-1.5">
              {e.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-os-fg/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-os-muted">
              Stack: {e.stack.join(", ")}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
