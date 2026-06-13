"use client";

import { useState } from "react";
import {
  User,
  Briefcase,
  FolderGit2,
  Wrench,
  GraduationCap,
  Award,
  Star,
  Quote,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AboutSection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
  EducationSection,
  CertificationsSection,
  AchievementsSection,
  TestimonialsSection,
  ContactSection,
} from "./sections";
import { cn } from "@/lib/utils";

type SectionId =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "achievements"
  | "testimonials"
  | "contact";

const NAV: {
  id: SectionId;
  label: string;
  icon: typeof User;
  group: "favourites" | "locations";
}[] = [
  { id: "about", label: "About Me", icon: User, group: "favourites" },
  { id: "experience", label: "Experience", icon: Briefcase, group: "favourites" },
  { id: "projects", label: "Projects", icon: FolderGit2, group: "favourites" },
  { id: "skills", label: "Skills", icon: Wrench, group: "favourites" },
  { id: "education", label: "Education", icon: GraduationCap, group: "locations" },
  { id: "certifications", label: "Certifications", icon: Award, group: "locations" },
  { id: "achievements", label: "Achievements", icon: Star, group: "locations" },
  { id: "testimonials", label: "Testimonials", icon: Quote, group: "locations" },
  { id: "contact", label: "Contact", icon: Mail, group: "locations" },
];

const SECTIONS: Record<SectionId, () => React.ReactNode> = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  education: EducationSection,
  certifications: CertificationsSection,
  achievements: AchievementsSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

export function Finder() {
  const [active, setActive] = useState<SectionId>("about");
  const [history, setHistory] = useState<SectionId[]>(["about"]);
  const [pos, setPos] = useState(0);

  function go(id: SectionId) {
    const next = history.slice(0, pos + 1).concat(id);
    setHistory(next);
    setPos(next.length - 1);
    setActive(id);
  }
  function back() {
    if (pos > 0) {
      setPos(pos - 1);
      setActive(history[pos - 1]);
    }
  }
  function forward() {
    if (pos < history.length - 1) {
      setPos(pos + 1);
      setActive(history[pos + 1]);
    }
  }

  const Section = SECTIONS[active];
  const activeLabel = NAV.find((n) => n.id === active)?.label ?? "";

  const renderGroup = (group: "favourites" | "locations", title: string) => (
    <div className="mb-3">
      <div className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-os-muted">
        {title}
      </div>
      {NAV.filter((n) => n.group === group).map((n) => {
        const Icon = n.icon;
        return (
          <button
            key={n.id}
            onClick={() => go(n.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors",
              active === n.id
                ? "bg-accent/80 text-white"
                : "text-os-fg/85 hover:bg-white/8"
            )}
          >
            <Icon size={15} className={active === n.id ? "text-white" : "text-accent"} />
            {n.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 overflow-y-auto border-r border-white/8 bg-black/20 py-3 os-scroll">
        {renderGroup("favourites", "Favourites")}
        {renderGroup("locations", "Locations")}
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* toolbar */}
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/8 px-4">
          <button
            onClick={back}
            disabled={pos === 0}
            className="rounded p-1 text-os-muted disabled:opacity-30 enabled:hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={forward}
            disabled={pos >= history.length - 1}
            className="rounded p-1 text-os-muted disabled:opacity-30 enabled:hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
          <span className="ml-2 font-semibold">{activeLabel}</span>
        </div>
        {/* content */}
        <div className="os-scroll flex-1 overflow-y-auto p-6">
          <Section />
        </div>
      </div>
    </div>
  );
}
