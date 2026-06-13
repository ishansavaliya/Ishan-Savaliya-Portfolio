import { getContent } from "@/lib/content";

const c = getContent();

/** Serialize a value to pretty TypeScript-ish source. */
function ts(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  const pad1 = "  ".repeat(indent + 1);
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return `"${value.replace(/"/g, '\\"')}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => `${pad1}${ts(v, indent + 1)}`).join(",\n");
    return `[\n${items},\n${pad}]`;
  }
  const obj = value as Record<string, unknown>;
  const entries = Object.entries(obj)
    .map(([k, v]) => `${pad1}${k}: ${ts(v, indent + 1)}`)
    .join(",\n");
  return `{\n${entries},\n${pad}}`;
}

function file(name: string, exportName: string, value: unknown, type: string) {
  return {
    name,
    language: "typescript",
    content: `// ${name} — generated from Ishan OS portfolio data\n\nexport const ${exportName}: ${type} = ${ts(value)};\n`,
  };
}

export interface CodeFile {
  name: string;
  language: string;
  content: string;
}

export interface FileTreeNode {
  name: string;
  type: "folder" | "file";
  path: string;
  children?: FileTreeNode[];
}

export const FILES: Record<string, CodeFile> = {
  "profile.ts": file("profile.ts", "profile", c.profile, "Profile"),
  "experience.ts": file("experience.ts", "experience", c.experience, "Experience[]"),
  "projects.ts": file("projects.ts", "projects", c.projects, "Project[]"),
  "skills.ts": file("skills.ts", "skills", c.skills, "SkillCategory[]"),
  "education.ts": file("education.ts", "education", c.education, "Education[]"),
  "certifications.ts": file(
    "certifications.ts",
    "certifications",
    c.certifications,
    "Certification[]"
  ),
  "achievements.ts": file(
    "achievements.ts",
    "achievements",
    c.achievements,
    "Achievement[]"
  ),
  "README.md": {
    name: "README.md",
    language: "markdown",
    content: `# ${c.profile.name}

> ${c.profile.title} — ${c.profile.location}

${c.profile.summary}

## Connect
${c.profile.socials.map((s) => `- **${s.label}**: ${s.url}`).join("\n")}

## Stack
${c.skills.map((s) => `- **${s.label}**: ${s.skills.map((k) => k.name).join(", ")}`).join("\n")}
`,
  },
};

export const FILE_TREE: FileTreeNode[] = [
  {
    name: "ishan-portfolio",
    type: "folder",
    path: "root",
    children: [
      {
        name: "src",
        type: "folder",
        path: "src",
        children: [
          { name: "profile.ts", type: "file", path: "profile.ts" },
          { name: "experience.ts", type: "file", path: "experience.ts" },
          { name: "projects.ts", type: "file", path: "projects.ts" },
          { name: "skills.ts", type: "file", path: "skills.ts" },
          { name: "education.ts", type: "file", path: "education.ts" },
          { name: "certifications.ts", type: "file", path: "certifications.ts" },
          { name: "achievements.ts", type: "file", path: "achievements.ts" },
        ],
      },
      { name: "README.md", type: "file", path: "README.md" },
    ],
  },
];

export const DEFAULT_FILE = "profile.ts";
