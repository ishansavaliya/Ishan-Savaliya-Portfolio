import { SITE_URL } from "@/lib/seo";
import { getAllPosts } from "@/lib/content/blog";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("")}
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ishan Savaliya — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles on AI, agents, MCP, Next.js and full-stack engineering.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
