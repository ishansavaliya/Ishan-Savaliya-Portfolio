import type { Metadata } from "next";
import { getContentFromDb } from "@/lib/content/server";
import { JsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Ishan Savaliya — Full-Stack Developer in Surat, India",
  description:
    "Ishan Savaliya is a full-stack developer (React, Next.js, Spring Boot, Java) based in Surat, Gujarat, India. Available for full-time roles and freelance projects worldwide.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const c = await getContentFromDb();
  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />
      <h1 className="text-3xl font-bold tracking-tight">
        About {c.profile.name}
      </h1>
      <p className="mt-2 text-accent-pink">
        {c.profile.title} · {c.profile.location}
      </p>
      <p className="mt-5 text-[17px] leading-relaxed text-os-fg/85">
        {c.profile.summary}
      </p>
      <div className="mt-5 space-y-3">
        {c.profile.about.map((p, i) => (
          <p key={i} className="leading-relaxed text-os-fg/80">
            {p}
          </p>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Find me online</h2>
      <ul className="mt-3 space-y-1.5">
        {c.profile.socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.url}
              className="text-accent hover:underline"
              rel="noopener"
            >
              {s.label}: {s.handle}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
