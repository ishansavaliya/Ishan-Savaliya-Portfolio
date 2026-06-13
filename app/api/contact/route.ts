import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendContactEmails } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, subject, body, company } = parsed.data;
  // Honeypot tripped → pretend success, drop silently.
  if (company) return NextResponse.json({ ok: true });

  // 1) Persist to Supabase first — never lose an inquiry.
  let stored = false;
  const admin = createAdminClient();
  if (admin) {
    const { error } = await admin
      .from("messages")
      .insert({ name, email, subject: subject || null, body });
    stored = !error;
  }

  // 2) Send notification + auto-reply (best effort).
  let emailed = false;
  try {
    const res = await sendContactEmails({ name, email, subject, body });
    emailed = res.sent;
  } catch {
    emailed = false;
  }

  if (!stored && !emailed) {
    return NextResponse.json(
      { error: "Could not deliver your message. Please email me directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, stored, emailed });
}
