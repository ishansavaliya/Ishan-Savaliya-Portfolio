/**
 * Generates supabase/seed.sql from the canonical lib/content/seed.ts so the
 * database seed stays perfectly in sync with the static fallback data.
 *
 * Run with:  node --experimental-strip-types scripts/gen-seed-sql.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { SEED } = await import("../lib/content/seed.ts");

const q = (v) =>
  v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`;
const j = (v) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

const lines = [];
lines.push("-- AUTO-GENERATED from lib/content/seed.ts — do not edit by hand.");
lines.push("-- Regenerate: node --experimental-strip-types scripts/gen-seed-sql.mjs\n");

const p = SEED.profile;
lines.push(`insert into profile (id, full_name, name, title, tagline, location, email, phone, availability, availability_note, summary, about, socials, resume_url, avatar_url)
values ('me', ${q(p.fullName)}, ${q(p.name)}, ${q(p.title)}, ${q(p.tagline)}, ${q(p.location)}, ${q(p.email)}, ${q(p.phone)}, ${q(p.availability)}, ${q(p.availabilityNote)}, ${q(p.summary)}, ${j(p.about)}, ${j(p.socials)}, ${q(p.resumeUrl)}, ${q(p.avatarUrl)})
on conflict (id) do update set full_name=excluded.full_name, name=excluded.name, title=excluded.title, tagline=excluded.tagline, location=excluded.location, email=excluded.email, phone=excluded.phone, availability=excluded.availability, availability_note=excluded.availability_note, summary=excluded.summary, about=excluded.about, socials=excluded.socials, resume_url=excluded.resume_url, avatar_url=excluded.avatar_url;\n`);

SEED.experience.forEach((e, i) => {
  lines.push(`insert into experience (id, company, role, type, start_label, end_label, location, current, highlights, stack, sort_order)
values (${q(e.id)}, ${q(e.company)}, ${q(e.role)}, ${q(e.type)}, ${q(e.start)}, ${q(e.end)}, ${q(e.location)}, ${e.current}, ${j(e.highlights)}, ${j(e.stack)}, ${i})
on conflict (id) do update set company=excluded.company, role=excluded.role, type=excluded.type, start_label=excluded.start_label, end_label=excluded.end_label, location=excluded.location, current=excluded.current, highlights=excluded.highlights, stack=excluded.stack, sort_order=excluded.sort_order;`);
});
lines.push("");

SEED.projects.forEach((pr, i) => {
  lines.push(`insert into projects (id, name, tagline, category, featured, description, highlights, stack, github, live, metrics, sort_order)
values (${q(pr.id)}, ${q(pr.name)}, ${q(pr.tagline)}, ${q(pr.category)}, ${pr.featured}, ${q(pr.description)}, ${j(pr.highlights)}, ${j(pr.stack)}, ${q(pr.github)}, ${q(pr.live)}, ${j(pr.metrics ?? [])}, ${i})
on conflict (id) do update set name=excluded.name, tagline=excluded.tagline, category=excluded.category, featured=excluded.featured, description=excluded.description, highlights=excluded.highlights, stack=excluded.stack, github=excluded.github, live=excluded.live, metrics=excluded.metrics, sort_order=excluded.sort_order;`);
});
lines.push("");

SEED.skills.forEach((s, i) => {
  lines.push(`insert into skills (id, label, skills, sort_order)
values (${q(s.id)}, ${q(s.label)}, ${j(s.skills)}, ${i})
on conflict (id) do update set label=excluded.label, skills=excluded.skills, sort_order=excluded.sort_order;`);
});
lines.push("");

SEED.education.forEach((e, i) => {
  lines.push(`insert into education (id, institution, degree, grade, start_label, end_label, location, sort_order)
values (${q(e.id)}, ${q(e.institution)}, ${q(e.degree)}, ${q(e.grade)}, ${q(e.start)}, ${q(e.end)}, ${q(e.location)}, ${i})
on conflict (id) do update set institution=excluded.institution, degree=excluded.degree, grade=excluded.grade, start_label=excluded.start_label, end_label=excluded.end_label, location=excluded.location, sort_order=excluded.sort_order;`);
});
lines.push("");

SEED.certifications.forEach((c, i) => {
  lines.push(`insert into certifications (id, name, issuer, url, category, sort_order)
values (${q(c.id)}, ${q(c.name)}, ${q(c.issuer)}, ${q(c.url)}, ${q(c.category)}, ${i})
on conflict (id) do update set name=excluded.name, issuer=excluded.issuer, url=excluded.url, category=excluded.category, sort_order=excluded.sort_order;`);
});
lines.push("");

SEED.testimonials.forEach((t) => {
  lines.push(`insert into testimonials (id, name, role, company, quote, url, approved)
values (${q(t.id)}, ${q(t.name)}, ${q(t.role)}, ${q(t.company)}, ${q(t.quote)}, ${q(t.url)}, true)
on conflict (id) do update set name=excluded.name, role=excluded.role, company=excluded.company, quote=excluded.quote, url=excluded.url, approved=excluded.approved;`);
});
lines.push("");

SEED.achievements.forEach((a, i) => {
  lines.push(`insert into achievements (id, title, description, date_label, category, sort_order)
values (${q(a.id)}, ${q(a.title)}, ${q(a.description)}, ${q(a.date)}, ${q(a.category)}, ${i})
on conflict (id) do update set title=excluded.title, description=excluded.description, date_label=excluded.date_label, category=excluded.category, sort_order=excluded.sort_order;`);
});
lines.push("");

const out = resolve(__dirname, "../supabase/seed.sql");
writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out}`);
