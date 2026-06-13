/**
 * Content model for Ishan OS. These types mirror the Supabase tables and are
 * also used by the static fallback seed, so the site works with or without a
 * database connection.
 */

export interface SocialLink {
  label: string;
  url: string;
  handle: string;
}

export interface Profile {
  name: string;
  fullName: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  availability: "available" | "open" | "unavailable";
  availabilityNote: string;
  summary: string;
  about: string[];
  socials: SocialLink[];
  resumeUrl: string;
  avatarUrl: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  type: "internship" | "full-time" | "freelance" | "contract";
  start: string;
  end: string; // "Present" allowed
  location: string;
  current: boolean;
  highlights: string[];
  stack: string[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: "personal" | "freelance" | "data-science";
  featured: boolean;
  description: string;
  highlights: string[];
  stack: string[];
  github?: string;
  live?: string;
  metrics?: { label: string; value: string }[];
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: { name: string; level: "expert" | "advanced" | "intermediate" | "learning" }[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  grade: string;
  start: string;
  end: string;
  location: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  url?: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  url?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  category: "award" | "milestone" | "open-source" | "speaking";
}

export interface PortfolioContent {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  achievements: Achievement[];
}
