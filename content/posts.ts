import type { BlogPost } from "@/types/blog";

/**
 * Blog posts — trend-focused technical articles. Authored as Markdown bodies,
 * rendered server-side at /blog/[slug] for full SEO indexing.
 *
 * These are starter posts; manage/replace them later via the admin panel.
 */
export const POSTS: BlogPost[] = [
  {
    slug: "model-context-protocol-mcp-explained",
    title: "Model Context Protocol (MCP): The USB-C of AI Apps, Explained",
    excerpt:
      "MCP is becoming the standard way to connect LLMs to tools and data. Here's what the Model Context Protocol is, why every AI team is adopting it, and how to think about building an MCP server in 2026.",
    tags: ["AI", "MCP", "LLM", "Architecture", "Agents"],
    category: "AI",
    publishedAt: "2026-05-28",
    readingTime: 7,
    coverGradient:
      "radial-gradient(120% 120% at 80% 10%, #9b6bff 0%, #2f80ff 55%, #120a2e 100%)",
    body: `## Why everyone is suddenly talking about MCP

For two years, every AI integration was a bespoke snowflake. Want your model to read a database? Write a custom tool. Hit an API? Another custom tool. Multiply that across every model, every framework, and every company and you get the integration mess the industry quietly accepted.

The **Model Context Protocol (MCP)** is the answer to that mess. Think of it as the *USB-C port for AI applications*: one open standard that lets any LLM-powered app talk to any tool, data source, or service through a consistent interface.

## What MCP actually is

At its core, MCP defines a client–server contract:

- **MCP servers** expose three things: **tools** (functions the model can call), **resources** (data the model can read), and **prompts** (reusable templates).
- **MCP clients** (your AI app, an IDE, a chat agent) discover those capabilities at runtime and let the model use them.

Because the protocol is standardized, an MCP server you write once works with *any* MCP-compatible client — no rewrites per model or vendor.

\`\`\`ts
// A minimal MCP tool definition (conceptual)
server.tool("get_bookings", {
  description: "Fetch bookings for a vendor",
  input: { vendorId: "string" },
  handler: async ({ vendorId }) => db.bookings.findByVendor(vendorId),
});
\`\`\`

## Why it matters in 2026

1. **Composability.** Agents can chain tools from multiple servers without glue code.
2. **Security boundaries.** Servers control exactly what the model can see and do.
3. **Portability.** Swap the underlying model (Gemini, Claude, GPT) without touching your integrations.

## Where MCP shines

- **Internal copilots** that need safe, audited access to company data.
- **Agentic workflows** where one model orchestrates many specialized tools.
- **Dev tools** — your editor's AI reading your repo through an MCP server.

## How to start

Pick one painful integration you already maintain by hand, wrap it as an MCP server with a clear tool schema, and point an MCP client at it. The moment you reuse that same server with a second client, the value clicks.

MCP won't make your model smarter — but it makes everything *around* the model dramatically simpler. In a year where agents are the headline, the boring protocol underneath them is what makes them actually work.`,
  },
  {
    slug: "ai-agents-2026-from-chatbots-to-coworkers",
    title: "AI Agents in 2026: From Chatbots to Autonomous Coworkers",
    excerpt:
      "Agentic AI is the defining trend of 2026. We break down what separates a real agent from a chatbot, the tool-use loop that powers them, and the practical patterns developers are shipping today.",
    tags: ["AI", "Agents", "LLM", "Automation", "Productivity"],
    category: "AI",
    publishedAt: "2026-06-04",
    readingTime: 8,
    coverGradient:
      "radial-gradient(120% 120% at 20% 0%, #00e0a4 0%, #1b6ef3 45%, #6b1bf3 80%, #120a2e 100%)",
    body: `## The year the chatbot grew up

In 2024 we asked models questions. In 2026 we *delegate work* to them. The shift from **chatbots** (you ask, it answers) to **agents** (you assign a goal, it plans and acts) is the single biggest theme in software this year.

## What actually makes something an "agent"

An agent isn't just a bigger prompt. It's a loop:

1. **Goal** — a high-level objective ("triage these support tickets").
2. **Plan** — the model breaks it into steps.
3. **Act** — it calls tools (APIs, databases, the file system) to do real work.
4. **Observe** — it reads the results.
5. **Repeat** — it adjusts until the goal is met or it asks for help.

\`\`\`txt
goal → plan → call tool → read result → reflect → act again → done
\`\`\`

The "act" step is what separates agents from chatbots — and it's why **tool use** and protocols like MCP have become foundational.

## Patterns developers are shipping

- **Single-agent + tools.** One model, a well-scoped toolset. Reliable, easy to debug. Start here.
- **Multi-agent orchestration.** A planner agent delegates to specialist agents (research, code, review). Powerful but harder to keep on the rails.
- **Human-in-the-loop.** The agent proposes; a person approves high-stakes actions. The default for anything touching production.

## The hard parts (that the demos hide)

- **Reliability.** A 95%-accurate step becomes ~60% accurate over ten steps. Guardrails and verification matter more than raw model quality.
- **Cost & latency.** Every loop iteration is another model call. Budget them.
- **Observability.** You can't fix what you can't see — log every plan, tool call, and result.

## A practical starting point

Don't build a swarm of autonomous agents on day one. Take one repetitive, well-defined task, give a single model the three or four tools it needs, add a human approval gate, and measure success rate honestly. Scale the autonomy only as reliability earns it.

The teams winning with agents in 2026 aren't the ones with the most agents — they're the ones who made a *few* agents genuinely trustworthy.`,
  },
  {
    slug: "modern-fullstack-stack-2026-nextjs-server-components",
    title: "The Modern Full-Stack Stack in 2026: Next.js, Server Components & the Edge",
    excerpt:
      "What does a production-grade full-stack app look like in 2026? A practical tour of Next.js App Router, React Server Components, type-safe data layers, and where Postgres + edge fit in.",
    tags: ["Next.js", "React", "Full-Stack", "TypeScript", "Web Development"],
    category: "Web Development",
    publishedAt: "2026-06-10",
    readingTime: 9,
    coverGradient:
      "radial-gradient(130% 130% at 30% 0%, #2dd4bf 0%, #2f6df6 45%, #4b2a8a 100%)",
    body: `## The stack has quietly stabilized

A few years of churn later, the modern full-stack stack has settled into a pragmatic shape. Here's what a production app looks like in 2026 — and *why* each piece earns its place.

## 1. Next.js App Router as the backbone

The App Router is no longer the new thing — it's the default. **React Server Components (RSC)** let you fetch data on the server and ship zero JavaScript for the parts of the page that don't need interactivity.

\`\`\`tsx
// A Server Component: runs on the server, ships no JS to the client
export default async function ProjectsPage() {
  const projects = await db.projects.findMany();
  return <ProjectGrid projects={projects} />;
}
\`\`\`

The mental model: **server by default, client when you need interactivity** (\`"use client"\`). Less JavaScript, faster pages, better SEO out of the box.

## 2. A type-safe data layer

TypeScript end-to-end is non-negotiable now. The winning pattern is a single source of truth for your data shapes, validated at the boundary:

- **Zod** for runtime validation of inputs and API payloads.
- **Postgres** (often via Supabase or Neon) with typed queries.
- Schema-driven design — store flexible data in **JSONB** when categories vary, keep relational integrity where it matters.

## 3. Rendering: static, dynamic, and the edge

You no longer pick one rendering strategy for the whole app — you pick per route:

- **Static** for marketing/blog pages (instant, cacheable, great for SEO).
- **Dynamic** for personalized or live data.
- **Edge** for low-latency, globally-distributed responses.

## 4. The supporting cast

- **Tailwind CSS** for styling velocity, **shadcn/ui** for accessible primitives.
- **Server Actions** for mutations without hand-rolling API routes.
- **Streaming + Suspense** so users see content as it's ready.

## 5. Deploy & observe

Push to **Vercel** (or your platform of choice), get preview deploys per PR, and wire in lightweight analytics. The feedback loop from commit to production is now minutes.

## The throughline

The 2026 stack isn't about chasing the newest library — it's about **doing less work on the client, validating everything at the edges, and rendering each route the smartest way for its job.** Master those three ideas and the specific tools become interchangeable.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function allPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
