// SERVER-ONLY module: imports next/headers via createServerSupabase.
// Never import this from a Client Component.
import type {
  PortfolioContent,
  Profile,
  Experience,
  Project,
  SkillCategory,
  Education,
  Certification,
  Testimonial,
  Achievement,
} from "@/types/content";
import { SEED } from "./seed";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Reads portfolio content from Supabase, falling back to SEED for any table
 * that is empty or errors. Use from Server Components / API routes only.
 */
export async function getContentFromDb(): Promise<PortfolioContent> {
  const supabase = await createServerSupabase();
  if (!supabase) return SEED;

  try {
    const [
      profileRes,
      experienceRes,
      projectsRes,
      skillsRes,
      educationRes,
      certsRes,
      testimonialsRes,
      achievementsRes,
    ] = await Promise.all([
      supabase.from("profile").select("*").eq("id", "me").maybeSingle(),
      supabase.from("experience").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("education").select("*").order("sort_order"),
      supabase.from("certifications").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").eq("approved", true),
      supabase.from("achievements").select("*").order("sort_order"),
    ]);

    const profile: Profile = profileRes.data
      ? {
          name: profileRes.data.name,
          fullName: profileRes.data.full_name,
          title: profileRes.data.title,
          tagline: profileRes.data.tagline ?? "",
          location: profileRes.data.location ?? "",
          email: profileRes.data.email ?? "",
          phone: profileRes.data.phone ?? "",
          availability: profileRes.data.availability ?? "open",
          availabilityNote: profileRes.data.availability_note ?? "",
          summary: profileRes.data.summary ?? "",
          about: profileRes.data.about ?? [],
          socials: profileRes.data.socials ?? [],
          resumeUrl: profileRes.data.resume_url ?? SEED.profile.resumeUrl,
          avatarUrl: profileRes.data.avatar_url ?? SEED.profile.avatarUrl,
        }
      : SEED.profile;

    const experience: Experience[] = experienceRes.data?.length
      ? experienceRes.data.map((e) => ({
          id: e.id,
          company: e.company,
          role: e.role,
          type: e.type,
          start: e.start_label ?? "",
          end: e.end_label ?? "",
          location: e.location ?? "",
          current: e.current ?? false,
          highlights: e.highlights ?? [],
          stack: e.stack ?? [],
        }))
      : SEED.experience;

    const projects: Project[] = projectsRes.data?.length
      ? projectsRes.data.map((p) => ({
          id: p.id,
          name: p.name,
          tagline: p.tagline ?? "",
          category: p.category,
          featured: p.featured ?? false,
          description: p.description ?? "",
          highlights: p.highlights ?? [],
          stack: p.stack ?? [],
          github: p.github ?? undefined,
          live: p.live ?? undefined,
          metrics: p.metrics ?? [],
        }))
      : SEED.projects;

    const skills: SkillCategory[] = skillsRes.data?.length
      ? skillsRes.data.map((s) => ({
          id: s.id,
          label: s.label,
          skills: s.skills ?? [],
        }))
      : SEED.skills;

    const education: Education[] = educationRes.data?.length
      ? educationRes.data.map((e) => ({
          id: e.id,
          institution: e.institution,
          degree: e.degree ?? "",
          grade: e.grade ?? "",
          start: e.start_label ?? "",
          end: e.end_label ?? "",
          location: e.location ?? "",
        }))
      : SEED.education;

    const certifications: Certification[] = certsRes.data?.length
      ? certsRes.data.map((c) => ({
          id: c.id,
          name: c.name,
          issuer: c.issuer ?? "",
          url: c.url ?? undefined,
          category: c.category ?? "",
        }))
      : SEED.certifications;

    const testimonials: Testimonial[] = testimonialsRes.data?.length
      ? testimonialsRes.data.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role ?? "",
          company: t.company ?? "",
          quote: t.quote,
          url: t.url ?? undefined,
        }))
      : SEED.testimonials;

    const achievements: Achievement[] = achievementsRes.data?.length
      ? achievementsRes.data.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description ?? "",
          date: a.date_label ?? undefined,
          category: a.category ?? "milestone",
        }))
      : SEED.achievements;

    return {
      profile,
      experience,
      projects,
      skills,
      education,
      certifications,
      testimonials,
      achievements,
    };
  } catch {
    return SEED;
  }
}
