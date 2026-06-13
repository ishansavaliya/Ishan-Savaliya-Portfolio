import { getContent } from "@/lib/content";
import type { AppId } from "@/types/os";

export interface CommandContext {
  /** Open another Ishan OS app from a command (e.g. `contact`, `resume`). */
  openApp: (id: AppId) => void;
  /** Clear the terminal buffer. */
  clear: () => void;
}

export interface CommandOutput {
  /** Lines of output. Each may contain inline markup tokens (see renderer). */
  lines: string[];
}

const c = getContent();

const HELP_ENTRIES: [string, string][] = [
  ["about", "Who I am"],
  ["experience", "Work history"],
  ["projects", "Featured & all projects"],
  ["project <name>", "Details for one project"],
  ["skills", "Tech stack by category"],
  ["skill <name>", "Where I've used a skill"],
  ["education", "Academic background"],
  ["certifications", "Certificates earned"],
  ["achievements", "Highlights & milestones"],
  ["testimonials", "What people say"],
  ["socials", "Find me online"],
  ["resume", "Open / download my resume"],
  ["contact", "Open the contact app"],
  ["blog", "Read my writing"],
  ["whoami", "Quick intro"],
  ["ls", "List sections"],
  ["pwd", "Print working directory"],
  ["clear", "Clear the screen"],
  ["help", "Show this help"],
];

const SECTIONS = [
  "about",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "achievements",
  "testimonials",
  "socials",
  "resume",
  "blog",
];

export const COMMAND_NAMES = [
  ...HELP_ENTRIES.map((e) => e[0].split(" ")[0]),
  "project",
  "skill",
];

function bullet(s: string) {
  return `  • ${s}`;
}

export function runCommand(
  raw: string,
  ctx: CommandContext
): CommandOutput | null {
  const input = raw.trim();
  if (!input) return { lines: [] };

  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(" ").toLowerCase();

  switch (cmd.toLowerCase()) {
    case "help":
      return {
        lines: [
          "Available commands:",
          "",
          ...HELP_ENTRIES.map(
            ([name, desc]) => `  ${name.padEnd(18)} ${desc}`
          ),
          "",
          "Tip: use ↑/↓ for history and Tab to autocomplete.",
        ],
      };

    case "whoami":
      return {
        lines: [`${c.profile.name} — ${c.profile.title}`, c.profile.tagline],
      };

    case "about":
      return {
        lines: [
          `${c.profile.fullName}`,
          `${c.profile.title} · ${c.profile.location}`,
          "",
          ...c.profile.about,
        ],
      };

    case "experience":
      return {
        lines: c.experience.flatMap((e) => [
          `${e.role} @ ${e.company}  (${e.start} – ${e.end})`,
          ...e.highlights.slice(0, 3).map(bullet),
          `  stack: ${e.stack.join(", ")}`,
          "",
        ]),
      };

    case "projects":
      return {
        lines: [
          "Featured projects (use `project <name>` for details):",
          "",
          ...c.projects
            .filter((p) => p.featured)
            .map((p) => `  ${p.name.padEnd(16)} ${p.tagline}`),
          "",
          "All projects:",
          ...c.projects.map((p) => `  ${p.id.padEnd(16)} [${p.category}]`),
        ],
      };

    case "project": {
      if (!arg) return { lines: ["usage: project <name>  (try `projects`)"] };
      const p = c.projects.find(
        (x) =>
          x.id.toLowerCase() === arg ||
          x.name.toLowerCase().includes(arg)
      );
      if (!p) return { lines: [`project not found: ${arg}`] };
      return {
        lines: [
          `${p.name} — ${p.tagline}`,
          `category: ${p.category}`,
          "",
          p.description,
          "",
          ...p.highlights.map(bullet),
          "",
          `stack: ${p.stack.join(", ")}`,
          ...(p.github ? [`github: ${p.github}`] : []),
          ...(p.live ? [`live: ${p.live}`] : []),
        ],
      };
    }

    case "skills":
      return {
        lines: c.skills.flatMap((s) => [
          `${s.label}:`,
          `  ${s.skills.map((k) => k.name).join(", ")}`,
          "",
        ]),
      };

    case "skill": {
      if (!arg) return { lines: ["usage: skill <name>"] };
      const found = c.skills
        .flatMap((s) => s.skills.map((k) => ({ ...k, cat: s.label })))
        .filter((k) => k.name.toLowerCase().includes(arg));
      if (!found.length) return { lines: [`skill not found: ${arg}`] };
      const projects = c.projects.filter((p) =>
        p.stack.some((s) => s.toLowerCase().includes(arg))
      );
      return {
        lines: [
          ...found.map((k) => `${k.name} — ${k.level} (${k.cat})`),
          ...(projects.length
            ? ["", "used in:", ...projects.map((p) => bullet(p.name))]
            : []),
        ],
      };
    }

    case "education":
      return {
        lines: c.education.flatMap((e) => [
          `${e.degree}`,
          `  ${e.institution} · ${e.grade}` +
            (e.end ? ` · ${e.start ? e.start + "–" : ""}${e.end}` : ""),
          "",
        ]),
      };

    case "certifications":
    case "certs":
      return {
        lines: c.certifications.map(
          (cert) => `  • ${cert.name} — ${cert.issuer}`
        ),
      };

    case "achievements":
      return {
        lines: c.achievements.flatMap((a) => [
          `  ★ ${a.title}`,
          `    ${a.description}`,
        ]),
      };

    case "testimonials":
      return {
        lines: c.testimonials.flatMap((t) => [
          `“${t.quote}”`,
          `  — ${t.name}, ${t.role} @ ${t.company}`,
          "",
        ]),
      };

    case "socials":
      return {
        lines: c.profile.socials.map(
          (s) => `  ${s.label.padEnd(10)} ${s.url}`
        ),
      };

    case "resume":
      ctx.openApp("resume");
      return { lines: ["Opening resume…", c.profile.resumeUrl] };

    case "contact":
      ctx.openApp("contact");
      return { lines: ["Opening contact app… or email me:", c.profile.email] };

    case "blog":
      ctx.openApp("browser");
      return { lines: ["Opening blog in the browser app…"] };

    case "ls":
      return { lines: ["sections:", "  " + SECTIONS.join("  ")] };

    case "pwd":
      return { lines: ["/home/ishan"] };

    case "cd":
      return { lines: [arg ? `cd: ${arg}: use a command instead (try \`ls\`)` : ""] };

    case "echo":
      return { lines: [args.join(" ")] };

    case "date":
      return { lines: [new Date().toString()] };

    case "clear":
      ctx.clear();
      return null;

    case "sudo":
      return { lines: ["Nice try 😄 — you don't have permission to do that."] };

    default:
      return {
        lines: [
          `command not found: ${cmd}`,
          "Type `help` to see what I can do.",
        ],
      };
  }
}

export const BANNER = [
  "Welcome to Ishan OS Terminal — v1.0",
  `${getContent().profile.name} · ${getContent().profile.title}`,
  "Type `help` to get started, or try `about`, `projects`, `skills`.",
  "",
];
