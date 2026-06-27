import type { Metadata } from "next";
import { SEED } from "@/lib/content/seed";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Ishan Savaliya — Hire a Full-Stack / Freelance Developer",
  description:
    "Get in touch with Ishan Savaliya for full-time roles or freelance projects. Full-stack developer (React, Next.js, Spring Boot) based in Surat, India — available worldwide.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = SEED.profile;
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
      />
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-2 text-os-fg/85">
        {c.availabilityNote}. Reach out for collaborations, freelance work, or
        full-time opportunities.
      </p>
      <ul className="mt-6 space-y-2">
        <li>
          Email:{" "}
          <a href={`mailto:${c.email}`} className="text-accent hover:underline">
            {c.email}
          </a>
        </li>
        <li>
          Phone:{" "}
          <a href={`tel:${c.phone}`} className="text-accent hover:underline">
            {c.phone}
          </a>
        </li>
        <li>Location: {c.location}</li>
        {c.socials.map((s) => (
          <li key={s.label}>
            {s.label}:{" "}
            <a href={s.url} className="text-accent hover:underline" rel="noopener">
              {s.handle}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-os-muted">
        Prefer the full experience?{" "}
        <a href="/" className="text-accent hover:underline">
          Open the contact app in Ishan OS
        </a>
        .
      </p>
    </article>
  );
}
