import { GoogleGenerativeAI } from "@google/generative-ai";
import { SEED } from "@/lib/content/seed";

export function hasGemini() {
  return Boolean(process.env.GEMINI_API_KEY);
}

/** Builds a grounding system prompt from Ishan's real portfolio data. */
export function buildSystemPrompt(): string {
  const c = SEED;
  const experience = c.experience
    .map(
      (e) =>
        `- ${e.role} @ ${e.company} (${e.start}–${e.end}): ${e.highlights.join(" ")} [stack: ${e.stack.join(", ")}]`
    )
    .join("\n");
  const projects = c.projects
    .map(
      (p) =>
        `- ${p.name} (${p.category}) — ${p.tagline}: ${p.description} [stack: ${p.stack.join(", ")}]${p.github ? ` github:${p.github}` : ""}${p.live ? ` live:${p.live}` : ""}`
    )
    .join("\n");
  const skills = c.skills
    .map((s) => `- ${s.label}: ${s.skills.map((k) => k.name).join(", ")}`)
    .join("\n");
  const education = c.education
    .map((e) => `- ${e.degree}, ${e.institution} (${e.grade})`)
    .join("\n");
  const certs = c.certifications.map((x) => `- ${x.name} (${x.issuer})`).join("\n");

  return `You are "Ishan AI", a friendly, concise assistant embedded in Ishan Savaliya's portfolio (a macOS-style web OS called Ishan OS). You answer questions about Ishan to recruiters, clients and visitors.

RULES:
- Answer ONLY from the facts below. If asked something not covered, say you don't have that info and suggest using the Contact app.
- Be warm, professional and brief (2–5 sentences unless asked for detail). Speak about Ishan in third person.
- When relevant, mention specific projects, the tech stack, and outcomes/metrics.
- Never invent employers, dates, or numbers.

ABOUT
${c.profile.fullName} — ${c.profile.title}, based in ${c.profile.location}.
Summary: ${c.profile.summary}
Availability: ${c.profile.availabilityNote}.
Contact: ${c.profile.email}. Socials: ${c.profile.socials.map((s) => `${s.label} ${s.url}`).join(", ")}.

EXPERIENCE
${experience}

PROJECTS
${projects}

SKILLS
${skills}

EDUCATION
${education}

CERTIFICATIONS
${certs}`;
}

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

/** Streams a Gemini response. Throws if the key is missing. */
export async function streamGemini(history: ChatTurn[], message: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    systemInstruction: buildSystemPrompt(),
  });

  const chat = model.startChat({
    history: history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    generationConfig: { maxOutputTokens: 600, temperature: 0.6 },
  });

  return chat.sendMessageStream(message);
}
