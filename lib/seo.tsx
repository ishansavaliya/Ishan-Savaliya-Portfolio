import { SEED } from "@/lib/content/seed";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ishansavaliya.me";

export const SITE_NAME = "Ishan Savaliya";

/** Keyword set targeting name, role, stack, location and freelance intent. */
export const KEYWORDS = [
  "Ishan Savaliya",
  "Ishan",
  "Savaliya",
  "Ishan Savaliya developer",
  "Ishan Savaliya portfolio",
  "Full Stack Developer",
  "Full Stack Developer Surat",
  "Full Stack Developer Gujarat",
  "Full Stack Developer India",
  "React developer",
  "Next.js developer",
  "Spring Boot developer",
  "Java developer",
  "Node.js developer",
  "TypeScript developer",
  "freelance web developer",
  "hire full stack developer",
  "freelance developer India",
  "web developer Surat",
  "software developer Gujarat",
  "AI developer",
  "remote full stack developer",
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SEED.profile.fullName,
  alternateName: ["Ishan Savaliya", "Ishan", "Savaliya"],
  jobTitle: SEED.profile.title,
  email: `mailto:${SEED.profile.email}`,
  telephone: SEED.profile.phone,
  url: SITE_URL,
  image: `${SITE_URL}${SEED.profile.avatarUrl}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Surat",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: "EMGAGE",
  },
  alumniOf: SEED.education.map((e) => ({
    "@type": "EducationalOrganization",
    name: e.institution,
  })),
  knowsAbout: SEED.skills.flatMap((s) => s.skills.map((k) => k.name)),
  sameAs: SEED.profile.socials.map((s) => s.url),
  description: SEED.profile.summary,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function personJsonLd() {
  return personSchema;
}
export function websiteJsonLd() {
  return websiteSchema;
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.url}`,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
