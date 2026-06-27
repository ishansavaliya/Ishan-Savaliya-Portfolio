import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, staticSlugs, getCommentsBySlug } from "@/lib/content/blog";
import { Markdown } from "@/components/blog/Markdown";
import { BlogEngagement } from "@/components/blog/BlogEngagement";
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
  const comments = await getCommentsBySlug(slug);

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
    image: post.coverImage ? [post.coverImage] : undefined,
    author: {
      "@type": "Person",
      name: post.authorName ?? "Ishan Savaliya",
      url: post.authorUrl ?? SITE_URL,
    },
    publisher: { "@type": "Person", name: "Ishan Savaliya" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  const authorName = post.authorName ?? "Ishan Savaliya";

  return (
    <article className="mx-auto max-w-4xl">
      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />

      {/* ---------- editorial header (centered) ---------- */}
      <header className="mx-auto max-w-3xl text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          ← All posts
        </Link>
        <div className="mt-6 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-os-muted">
          <span className="text-accent">{post.category}</span>
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
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-os-fg/70">
          {post.excerpt}
        </p>

        {/* byline */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
            {authorName.charAt(0)}
          </span>
          <div className="text-left text-sm">
            <div className="text-os-fg/90">
              {post.authorUrl ? (
                <a
                  href={post.authorUrl}
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="font-medium hover:text-accent hover:underline"
                >
                  {authorName}
                </a>
              ) : (
                <span className="font-medium">{authorName}</span>
              )}
            </div>
            <div className="text-xs text-os-muted">Author</div>
          </div>
        </div>
      </header>

      {/* full-bleed cover */}
      <div
        className="relative mt-10 aspect-[16/8] w-full overflow-hidden rounded-3xl border border-white/10"
        style={{ background: post.coverGradient }}
      >
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {/* body — narrower measure for readability */}
      <div className="mx-auto mt-12 max-w-3xl text-[17px] leading-8">
        <Markdown source={post.body} />
      </div>

      {/* tags + author + engagement constrained to the reading measure */}
      <div className="mx-auto max-w-3xl">
        <div className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-6">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/8 px-2.5 py-1 text-sm text-os-muted"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* author credit */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-base font-semibold text-accent">
            {authorName.charAt(0)}
          </span>
          <div className="text-sm">
            <div className="text-os-muted">Written by</div>
            <div className="font-medium text-os-fg">
              {post.authorUrl ? (
                <a
                  href={post.authorUrl}
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="hover:text-accent hover:underline"
                >
                  {authorName} ↗
                </a>
              ) : (
                authorName
              )}
            </div>
          </div>
        </div>

        <BlogEngagement
          slug={post.slug}
          initialLikes={post.likes ?? 0}
          initialComments={comments}
        />
      </div>
    </article>
  );
}
