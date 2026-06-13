import { NextResponse } from "next/server";
import { z } from "zod";
import { streamGemini, hasGemini, type ChatTurn } from "@/lib/gemini";

export const runtime = "nodejs";

const schema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().max(4000),
      })
    )
    .max(20)
    .optional(),
});

export async function POST(req: Request) {
  if (!hasGemini()) {
    return NextResponse.json(
      { error: "AI is not configured yet. Add GEMINI_API_KEY to enable it." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const { message, history = [] } = parsed.data;

  try {
    const result = await streamGemini(history as ChatTurn[], message);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch {
          controller.enqueue(encoder.encode("\n[stream interrupted]"));
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "AI request failed. Please try again." },
      { status: 502 }
    );
  }
}
