import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, staticSlugs } from "@/lib/content/blog";
import { Markdown } from "@/components/blog/Markdown";
import { JsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export function generateStaticParams() {
  return staticSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Person", name: "Ishan Savaliya", url: SITE_URL },
    publisher: { "@type": "Person", name: "Ishan Savaliya" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article>
      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />
      <Link href="/blog" className="text-sm text-accent hover:underline">
        ← All posts
      </Link>
      <div
        className="mt-4 h-40 w-full rounded-2xl"
        style={{ background: post.coverGradient }}
      />
      <div className="mt-5 flex items-center gap-2 text-xs text-os-muted">
        <span>{post.category}</span>
        <span>·</span>
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{post.readingTime} min read</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-lg text-os-fg/70">{post.excerpt}</p>
      <div className="mt-8 border-t border-white/10 pt-8">
        <Markdown source={post.body} />
      </div>
      <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
        {post.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-white/8 px-2.5 py-1 text-sm text-os-muted"
          >
            #{t}
          </span>
        ))}
      </div>
    </article>
  );
}
