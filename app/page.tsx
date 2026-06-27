import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";
import { JsonLd, websiteJsonLd, personJsonLd } from "@/lib/seo";
import { getActiveAnnouncement } from "@/lib/content/server";
import { getAllPosts } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Ishan Savaliya — Full-Stack Developer (React, Next.js, Spring Boot)",
  description:
    "Ishan Savaliya is a full-stack developer in Surat, India building production web apps with React, Next.js, Spring Boot and Java. Available for full-time and freelance work. Explore the classic portfolio or boot the interactive Ishan OS.",
  alternates: { canonical: "/" },
};

// Revalidate so a new announcement set in the admin appears without redeploy.
export const revalidate = 60;

export default async function Home() {
  const [announcement, allPosts] = await Promise.all([
    getActiveAnnouncement(),
    getAllPosts(),
  ]);
  // Latest 3 for the landing teaser (already date-sorted desc).
  const posts = allPosts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readingTime: p.readingTime,
    coverGradient: p.coverGradient,
    coverImage: p.coverImage ?? null,
    likes: p.likes ?? 0,
  }));
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Landing announcement={announcement} posts={posts} />
    </>
  );
}
