"use client";

import Image from "next/image";
import {
  GitHub,
  Linkedin2,
  Globe,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Award,
  Star,
} from "@/components/os/icons/brand";
import { getContent } from "@/lib/content";
import { useWindowStore } from "@/lib/store/useWindowStore";

const c = getContent();

const levelWidth: Record<string, string> = {
  expert: "100%",
  advanced: "80%",
  intermediate: "60%",
  learning: "35%",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-semibold tracking-tight text-os-fg">
      {children}
    </h2>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] text-os-fg/80 ring-1 ring-white/10">
      {children}
    </span>
  );
}

export function AboutSection() {
  return (
    <div className="selectable">
      <div className="mb-6 flex items-center gap-5">
        <Image
          src={c.profile.avatarUrl}
          alt={c.profile.name}
          width={88}
          height={88}
          className="h-22 w-22 rounded-2xl object-cover ring-1 ring-white/15"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{c.profile.name}</h1>
          <p className="text-accent-pink">{c.profile.title}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-os-muted">
            <MapPin size={13} /> {c.profile.location}
          </p>
        </div>
      </div>
      <p className="mb-5 text-[15px] leading-relaxed text-os-fg/85">
        {c.profile.summary}
      </p>
      <div className="space-y-3">
        {c.profile.about.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-os-fg/80">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ExperienceSection() {
  return (
    <div className="selectable">
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-6 border-l border-white/12 pl-6">
        {c.experience.map((e) => (
          <div key={e.id} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-[var(--glass-bg)]" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">{e.role}</h3>
              <span className="text-sm text-os-muted">
                {e.start} – {e.end}
              </span>
            </div>
            <p className="mb-2 text-accent-pink">
              {e.company} · <span className="text-os-muted">{e.location}</span>
            </p>
            <ul className="mb-3 space-y-1.5">
              {e.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-os-fg/80">
                  <span className="text-accent">▸</span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5">
              {e.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const cats = [
    { key: "personal", label: "Personal" },
    { key: "freelance", label: "Freelance / Client" },
    { key: "data-science", label: "Data Science & ML" },
  ] as const;
  return (
    <div className="selectable">
      <SectionTitle>Projects</SectionTitle>
      <div className="space-y-7">
        {cats.map((cat) => {
          const list = c.projects.filter((p) => p.category === cat.key);
          if (!list.length) return null;
          return (
            <div key={cat.key}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-os-muted">
                {cat.label}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {list.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/8"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="font-semibold">{p.name}</h4>
                      <div className="flex gap-2 text-os-muted">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                            <GitHub size={15} className="hover:text-os-fg" />
                          </a>
                        )}
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noreferrer" aria-label="Live">
                            <ExternalLink size={15} className="hover:text-os-fg" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="mb-2 text-xs text-accent-pink">{p.tagline}</p>
                    <p className="mb-3 text-[13px] leading-snug text-os-fg/75">
                      {p.description}
                    </p>
                    {p.metrics && p.metrics.length > 0 && (
                      <div className="mb-3 flex gap-3">
                        {p.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="text-base font-bold text-accent">
                              {m.value}
                            </div>
                            <div className="text-[10px] uppercase text-os-muted">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <div className="selectable">
      <SectionTitle>Skills</SectionTitle>
      <div className="grid gap-6 sm:grid-cols-2">
        {c.skills.map((cat) => (
          <div key={cat.id}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-os-muted">
              {cat.label}
            </h3>
            <div className="space-y-2.5">
              {cat.skills.map((s) => (
                <div key={s.name}>
                  <div className="mb-1 flex justify-between text-[13px]">
                    <span>{s.name}</span>
                    <span className="text-os-muted">{s.level}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-pink"
                      style={{ width: levelWidth[s.level] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EducationSection() {
  return (
    <div className="selectable">
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-4">
        {c.education.map((e) => (
          <div key={e.id} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">{e.institution}</h3>
              <span className="text-sm text-os-muted">
                {e.start ? `${e.start} – ` : ""}
                {e.end}
              </span>
            </div>
            <p className="text-accent-pink">{e.degree}</p>
            <p className="text-sm text-os-muted">
              {e.grade} · {e.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CertificationsSection() {
  return (
    <div className="selectable">
      <SectionTitle>Certifications</SectionTitle>
      <div className="space-y-3">
        {c.certifications.map((cert) => (
          <a
            key={cert.id}
            href={cert.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/8"
          >
            <Award size={22} className="text-accent" />
            <div className="flex-1">
              <div className="font-medium">{cert.name}</div>
              <div className="text-sm text-os-muted">{cert.issuer}</div>
            </div>
            <ExternalLink size={15} className="text-os-muted" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function AchievementsSection() {
  return (
    <div className="selectable">
      <SectionTitle>Achievements</SectionTitle>
      <div className="space-y-3">
        {c.achievements.map((a) => (
          <div key={a.id} className="flex gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <Star size={20} className="mt-0.5 text-accent-yellow" />
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-os-muted">{a.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <div className="selectable">
      <SectionTitle>Testimonials</SectionTitle>
      <div className="space-y-4">
        {c.testimonials.map((t) => (
          <blockquote
            key={t.id}
            className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10"
          >
            <p className="mb-3 text-[15px] italic leading-relaxed text-os-fg/85">
              “{t.quote}”
            </p>
            <footer className="text-sm text-os-muted">
              <span className="font-medium text-os-fg">{t.name}</span> — {t.role},{" "}
              {t.company}
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}

export function ContactSection() {
  const openApp = useWindowStore((s) => s.openApp);
  return (
    <div className="selectable">
      <SectionTitle>Contact</SectionTitle>
      <div className="space-y-3">
        <a
          href={`mailto:${c.profile.email}`}
          className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/8"
        >
          <Mail size={18} className="text-accent-pink" /> {c.profile.email}
        </a>
        <a
          href={`tel:${c.profile.phone}`}
          className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/8"
        >
          <Phone size={18} className="text-accent" /> {c.profile.phone}
        </a>
        {c.profile.socials.map((s) => {
          const Icon =
            s.label === "GitHub"
              ? GitHub
              : s.label === "LinkedIn"
                ? Linkedin2
                : Globe;
          return (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/8"
            >
              <Icon size={18} className="text-os-fg/70" /> {s.label}
              <span className="ml-auto text-sm text-os-muted">{s.handle}</span>
            </a>
          );
        })}
        <button
          onClick={() => openApp("contact")}
          className="mt-2 w-full rounded-xl bg-accent py-3 font-medium text-white transition hover:opacity-90"
        >
          Open Contact Form
        </button>
      </div>
    </div>
  );
}
