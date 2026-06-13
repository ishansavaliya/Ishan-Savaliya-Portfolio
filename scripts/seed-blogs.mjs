/**
 * Seeds the Supabase `blogs` table from content/posts.ts via the REST API
 * (service-role key). Run once: node --experimental-strip-types scripts/seed-blogs.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Load env from .env.local
const env = Object.fromEntries(
  readFileSync(resolve(root, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const { POSTS } = await import("../content/posts.ts");

const rows = POSTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  body: p.body,
  tags: p.tags,
  cover_image: p.coverGradient,
  reading_time: p.readingTime,
  published: true,
  published_at: new Date(p.publishedAt).toISOString(),
}));

const res = await fetch(`${URL}/rest/v1/blogs?on_conflict=slug`, {
  method: "POST",
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(rows),
});

if (!res.ok) {
  console.error("Seed failed:", res.status, await res.text());
  process.exit(1);
}
const data = await res.json();
console.log(`Seeded ${data.length} blog posts.`);
