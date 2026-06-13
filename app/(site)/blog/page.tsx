import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content/blog";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog — Ishan Savaliya | AI, Next.js & Full-Stack Engineering",
  description:
    "Articles on AI agents, the Model Context Protocol (MCP), Next.js, React Server Components and modern full-stack engineering by Ishan Savaliya.",
  alternates: { canonical: "/blog" },
};

// Revalidate so new posts published in the admin appear without a redeploy.
export const revalidate = 60;

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-os-muted">
        Writing on AI, agents, MCP, Next.js and modern full-stack engineering.
      </p>
      <div className="mt-8 space-y-6">
        {posts.map((p) => (
          <article key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block">
              <div
                className="mb-3 h-32 w-full rounded-xl"
                style={{ background: p.coverGradient }}
              />
              <div className="mb-1 flex items-center gap-2 text-xs text-os-muted">
                <span>{p.category}</span>
                <span>·</span>
                <time dateTime={p.publishedAt}>
                  {new Date(p.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{p.readingTime} min read</span>
              </div>
              <h2 className="text-xl font-semibold group-hover:text-accent">
                {p.title}
              </h2>
              <p className="mt-1 text-os-fg/75">{p.excerpt}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] text-os-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
