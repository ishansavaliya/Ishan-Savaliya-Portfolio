"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Mail,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Building2,
  Briefcase,
  Download,
  Megaphone,
} from "lucide-react";
import { getContent } from "@/lib/content";
import { GitHub, Linkedin2 } from "@/components/os/icons/brand";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { Navbar } from "./Navbar";
import { skillIcon } from "./skillIcons";
import { ContactForm } from "./ContactForm";
import { LandingChat } from "./LandingChat";
import { Heart } from "lucide-react";

interface LandingPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  coverGradient: string;
  coverImage: string | null;
  likes: number;
}

const c = getContent();

function Eyebrow({ cmd }: { cmd: string }) {
  return (
    <div className="mb-4 font-mono text-[13px] tracking-tight text-accent">
      <span className="text-os-muted">$</span> {cmd}
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  onLoad = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  onLoad?: boolean;
  className?: string;
}) {
  const anim = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      {...(onLoad
        ? { animate: anim }
        : { whileInView: anim, viewport: { once: true, margin: "-80px" } })}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

const WRAP = "mx-auto w-full max-w-7xl px-6";
const SECTION = `${WRAP} py-24 md:py-32`;

export function Landing(props: {
  announcement?: string | null;
  posts?: LandingPost[];
}) {
  return (
    <ThemeProvider>
      <LandingInner {...props} />
    </ThemeProvider>
  );
}

function LandingInner({
  announcement,
  posts = [],
}: {
  announcement?: string | null;
  posts?: LandingPost[];
}) {
  const { theme, toggle } = useTheme();
  const personal = c.projects.filter((p) => p.category === "personal");
  const freelance = c.projects.filter((p) => p.category === "freelance");

  return (
    <div className="landing-scroll landing-bg grain os-scroll text-os-fg" id="top">
      <Navbar theme={theme} onToggle={toggle} />

      {/* ===================== HERO ===================== */}
      <section className={`${WRAP} grid items-center gap-10 pb-14 pt-16 md:grid-cols-[1.15fr_0.85fr] md:pt-24`}>
        <div>
          {announcement && (
            <Reveal onLoad delay={0}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
                <Megaphone size={14} />
                <span className="text-os-fg/90">{announcement}</span>
              </div>
            </Reveal>
          )}
          <Reveal onLoad delay={0.05}>
            <h1 className="font-display text-6xl font-bold leading-[0.98] tracking-tight md:text-8xl">
              Ishan
              <br />
              <span className="bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
                Savaliya
              </span>
            </h1>
          </Reveal>
          <Reveal onLoad delay={0.1}>
            <p className="mt-4 font-display text-2xl font-medium text-os-muted md:text-3xl">
              {c.profile.title}
            </p>
          </Reveal>
          <Reveal onLoad delay={0.15}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-os-fg/75">
              {c.profile.tagline} Based in {c.profile.location}. I build scalable
              backends, REST APIs and AI-integrated products — and shipped my
              portfolio as a full operating system.
            </p>
          </Reveal>
          <Reveal onLoad delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#projects" className="rounded-full bg-os-fg px-6 py-3 text-sm font-medium text-os-bg transition hover:opacity-90">
                View my work
              </a>
              <a
                href={c.profile.resumeUrl}
                download
                className="group flex items-center gap-2 rounded-full border border-glass-border bg-[var(--glass-bg)] px-6 py-3 text-sm font-medium backdrop-blur transition hover:border-accent"
              >
                <Download size={16} className="text-accent" />
                Download Resume
              </a>
              <Link href="/os" className="group flex items-center gap-2 rounded-full border border-glass-border bg-[var(--glass-bg)] px-6 py-3 text-sm font-medium backdrop-blur transition hover:border-accent">
                <Sparkles size={16} className="text-accent" />
                Boot Ishan OS
                <span className="font-mono text-xs text-os-muted">⌘</span>
              </Link>
            </div>
            <p className="mt-4 font-mono text-xs text-os-muted">
              {"// technical? the OS is the real experience →"}
            </p>
          </Reveal>
        </div>

        {/* hero image */}
        <Reveal onLoad delay={0.1} className="relative mx-auto max-w-sm">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/30 to-accent-pink/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-glass-border">
            <Image
              src="/brand/Ishan.jpeg"
              alt="Ishan Savaliya"
              width={520}
              height={650}
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4 font-mono text-xs text-white/90">
              <span>@ishansavaliya</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} /> Surat, IN
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <div className="overflow-hidden border-y border-glass-border py-5">
        <div className="flex gap-10 whitespace-nowrap font-mono text-base text-os-muted [animation:marquee_32s_linear_infinite]">
          {[...techList(), ...techList()].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===================== ABOUT ===================== */}
      <section id="about" className={SECTION}>
        <Reveal>
          <Eyebrow cmd="cat about.md" />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">About</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="h-full rounded-3xl border border-glass-border bg-[var(--glass-bg)] p-8 backdrop-blur">
              <div className="space-y-4 text-lg leading-relaxed text-os-fg/80">
                {c.profile.about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-glass-border pt-6 sm:grid-cols-4">
                {[
                  { k: "Experience", v: "3 roles" },
                  { k: "Projects", v: `${c.projects.length}+` },
                  { k: "Clients", v: "Live" },
                  { k: "Based in", v: "Surat, IN" },
                ].map((s) => (
                  <div key={s.k}>
                    <div className="font-display text-2xl font-bold text-accent">{s.v}</div>
                    <div className="text-xs uppercase tracking-wide text-os-muted">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-glass-border bg-[var(--glass-bg)] p-8 backdrop-blur">
              <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-os-muted">
                <GraduationCap size={16} className="text-accent" /> Education
              </div>
              <div className="relative space-y-6 border-l border-glass-border pl-6">
                {c.education.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-[var(--glass-bg)]" />
                    <div className="font-medium">{e.degree}</div>
                    <div className="text-sm text-os-muted">{e.institution}</div>
                    <div className="mt-0.5 font-mono text-xs text-accent-pink">{e.grade}</div>
                    <div className="font-mono text-xs text-os-muted">{e.location} · {e.end}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== EXPERIENCE ===================== */}
      <section id="experience" className={SECTION}>
        <Reveal>
          <Eyebrow cmd="cat experience.md" />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Experience</h2>
          <p className="mt-2 text-os-muted">Where I&apos;ve shipped production work.</p>
        </Reveal>
        <div className="mt-14 space-y-8">
          {c.experience.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <div className="group grid gap-6 rounded-3xl border border-glass-border bg-[var(--glass-bg)] p-8 backdrop-blur transition hover:border-accent/50 md:grid-cols-[260px_1fr]">
                {/* left rail */}
                <div className="flex flex-col gap-3 md:border-r md:border-glass-border md:pr-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <Building2 size={22} />
                  </span>
                  {e.companyUrl ? (
                    <a href={e.companyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-display text-lg font-bold hover:text-accent">
                      {e.company} <ExternalLink size={13} className="text-os-muted" />
                    </a>
                  ) : (
                    <span className="font-display text-lg font-bold">{e.company}</span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm text-accent-pink">
                    <Briefcase size={14} /> {e.role}
                  </span>
                  <span className="font-mono text-xs text-os-muted">{e.start} – {e.end}</span>
                  <span className="font-mono text-xs text-os-muted">{e.location}</span>
                </div>
                {/* right details */}
                <div>
                  <ul className="space-y-2.5">
                    {e.highlights.map((h, j) => (
                      <li key={j} className="flex gap-3 leading-relaxed text-os-fg/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {e.stack.map((s) => {
                      const icon = skillIcon(s);
                      return (
                        <span key={s} className="flex items-center gap-1.5 rounded-lg border border-glass-border bg-[var(--os-bg)] px-2.5 py-1 text-xs">
                          {icon && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={icon} alt="" width={14} height={14} className="h-3.5 w-3.5" loading="lazy" />
                          )}
                          {s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== PROJECTS (personal) ===================== */}
      <section id="projects" className={SECTION}>
        <Reveal>
          <Eyebrow cmd="ls projects/" />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Projects</h2>
          <p className="mt-2 text-os-muted">Personal & AI builds.</p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {personal.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.05}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== FREELANCE ===================== */}
      <section id="freelance" className={`${WRAP} py-24 md:py-32`}>
        <Reveal>
          <Eyebrow cmd="ls freelance/ --live" />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Freelance & client work
          </h2>
          <p className="mt-2 text-os-muted">Shipped to real businesses.</p>
        </Reveal>
        <div className="mt-10 space-y-6">
          {freelance.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl border border-glass-border bg-[var(--glass-bg)] p-7 backdrop-blur transition hover:border-accent/60 md:p-9">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition group-hover:bg-accent/20" />
                <div className="relative grid gap-7 md:grid-cols-[1fr_1.4fr]">
                  {/* left: identity */}
                  <div>
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent-pink/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-accent-pink">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-pink" /> Live client
                    </div>
                    <h3 className="font-display text-3xl font-bold">{p.name}</h3>
                    <p className="mt-1.5 text-sm text-os-muted">{p.tagline}</p>
                    <p className="mt-4 text-sm leading-relaxed text-os-fg/70">{p.description}</p>
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Visit live site <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {/* right: what was built */}
                  <div>
                    <div className="mb-3 font-mono text-xs uppercase tracking-wide text-os-muted">
                      What I built
                    </div>
                    <ul className="space-y-2.5">
                      {p.highlights.slice(0, 5).map((h, hi) => (
                        <li key={hi} className="flex gap-2.5 text-sm leading-relaxed text-os-fg/80">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => <Tag key={s}>{s}</Tag>)}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== SKILLS ===================== */}
      <section id="skills" className={SECTION}>
        <Reveal>
          <Eyebrow cmd="cat skills.json" />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Tech stack</h2>
        </Reveal>
        <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.skills.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 0.05} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-glass-border bg-[var(--glass-bg)] p-7 backdrop-blur transition hover:border-accent/40">
                <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-os-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {cat.label}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {cat.skills.map((s) => {
                    const icon = skillIcon(s.name);
                    return (
                      <span
                        key={s.name}
                        className="group flex items-center gap-2 rounded-xl border border-glass-border bg-[var(--os-bg)] px-3 py-2 text-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_10px_24px_-10px_var(--accent)]"
                      >
                        {icon && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={icon} alt="" width={18} height={18} className="h-[18px] w-[18px] transition group-hover:scale-110" loading="lazy" />
                        )}
                        {s.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== BLOG ===================== */}
      <section id="blog" className={SECTION}>
        <Reveal>
          <Eyebrow cmd="ls blog/" />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Writing</h2>
              <p className="mt-2 text-os-muted">AI, agents, Next.js & engineering.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/write" className="rounded-full border border-glass-border px-4 py-2 text-sm transition hover:border-accent">
                ✍️ Write a post
              </Link>
              <Link href="/blog" className="flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
                All posts <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
        {posts.length === 0 ? (
          <p className="mt-14 text-os-muted">No posts yet — check back soon.</p>
        ) : (
          <div className="mt-14 grid auto-rows-fr gap-7 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06} className="h-full">
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-glass-border bg-[var(--glass-bg)] backdrop-blur transition hover:-translate-y-1 hover:border-accent/50">
                  <div className="relative h-44 overflow-hidden" style={{ background: p.coverGradient }}>
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverImage}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-os-muted">
                      <span>{p.readingTime} min read</span>
                      <span className="flex items-center gap-1 text-accent-pink">
                        <Heart size={12} className="fill-current" /> {p.likes}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold leading-snug group-hover:text-accent">{p.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-os-fg/65">{p.excerpt}</p>
                    <span className="mt-4 flex items-center gap-1 text-sm text-accent">
                      Read <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ===================== CONTACT ===================== */}
      <section id="contact" className={SECTION}>
        <Reveal>
          <Eyebrow cmd="./contact.sh" />
          <div className="grid gap-10 rounded-3xl border border-glass-border bg-[var(--glass-bg)] p-8 backdrop-blur md:grid-cols-2 md:p-12">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Let&apos;s build<br />something.
              </h2>
              <div className="mt-8 flex flex-col gap-3 text-sm">
                <a href={`mailto:${c.profile.email}`} className="flex items-center gap-2 break-all text-os-fg/80 hover:text-os-fg">
                  <Mail size={16} className="shrink-0 text-accent" /> {c.profile.email}
                </a>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-os-muted">
                  {c.profile.socials.map((s) => {
                    const Icon = s.label === "GitHub" ? GitHub : s.label === "LinkedIn" ? Linkedin2 : null;
                    return (
                      <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition hover:text-os-fg">
                        {Icon ? <Icon size={15} /> : null} {s.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative mt-10 border-t border-glass-border">
        {/* columns */}
        <div className={`${WRAP} grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr]`}>
          <div>
            <div className="flex items-center gap-2.5 font-display text-xl font-bold">
              <Image src="/brand/is-logo-mark.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
              Ishan Savaliya
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-os-muted">
              Full-Stack Developer building production web apps & AI products.
              Open to full-time and freelance work, worldwide.
            </p>
            <div className="mt-5 flex gap-3">
              {c.profile.socials.map((s) => {
                const Icon = s.label === "GitHub" ? GitHub : s.label === "LinkedIn" ? Linkedin2 : null;
                return Icon ? (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border text-os-muted transition hover:border-accent hover:text-os-fg">
                    <Icon size={16} />
                  </a>
                ) : null;
              })}
            </div>
          </div>
          <div>
            <div className="mb-4 font-mono text-xs uppercase tracking-wide text-os-muted">Explore</div>
            <ul className="space-y-2.5 text-sm text-os-fg/75">
              <li><a href="#about" className="hover:text-accent">About</a></li>
              <li><a href="#experience" className="hover:text-accent">Experience</a></li>
              <li><a href="#projects" className="hover:text-accent">Projects</a></li>
              <li><a href="#freelance" className="hover:text-accent">Freelance</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-4 font-mono text-xs uppercase tracking-wide text-os-muted">More</div>
            <ul className="space-y-2.5 text-sm text-os-fg/75">
              <li><Link href="/blog" className="hover:text-accent">Blog</Link></li>
              <li><Link href="/write" className="hover:text-accent">Write a post</Link></li>
              <li><Link href="/os" className="hover:text-accent">Ishan OS →</Link></li>
              <li><a href={`mailto:${c.profile.email}`} className="hover:text-accent">Email me</a></li>
            </ul>
          </div>
        </div>
        {/* huge name */}
        <div className="overflow-hidden px-6">
          <div className="select-none whitespace-nowrap text-center font-display text-[24vw] font-bold leading-[0.8] tracking-tighter text-os-fg/[0.08]">
            &lt;ISHAN&gt;
          </div>
        </div>
        <div className="border-t border-glass-border">
          <div className={`${WRAP} flex flex-wrap items-center justify-between gap-2 py-5 font-mono text-xs text-os-muted`}>
            <span>© 2026 {c.profile.fullName}</span>
            <span>Built with Next.js · Supabase</span>
          </div>
        </div>
      </footer>

      {/* floating Ishan AI chatbot */}
      <LandingChat />
    </div>
  );
}

function techList() {
  return ["React", "Next.js", "TypeScript", "Spring Boot", "Java", "Node.js", "PostgreSQL", "AWS", "Docker"];
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-glass-border bg-[var(--os-bg)] px-2 py-0.5 text-[11px] text-os-fg/80">
      {children}
    </span>
  );
}

function ProjectCard({ p }: { p: ReturnType<typeof getContent>["projects"][number] }) {
  return (
    <div className="group flex h-full flex-col rounded-3xl border border-glass-border bg-[var(--glass-bg)] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-accent/60">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <div className="flex gap-2 text-os-muted">
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHub size={16} className="hover:text-os-fg" />
            </a>
          )}
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" aria-label="Live">
              <ExternalLink size={16} className="hover:text-os-fg" />
            </a>
          )}
        </div>
      </div>
      <div className="mb-2 text-xs font-medium text-accent-pink">{p.tagline}</div>
      <p className="mb-4 flex-1 text-sm leading-snug text-os-fg/70">{p.description}</p>
      {p.metrics && p.metrics.length > 0 && (
        <div className="mb-4 flex gap-5">
          {p.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-xl font-bold text-accent">{m.value}</div>
              <div className="text-[10px] uppercase tracking-wide text-os-muted">{m.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {p.stack.slice(0, 4).map((s) => <Tag key={s}>{s}</Tag>)}
      </div>
    </div>
  );
}
