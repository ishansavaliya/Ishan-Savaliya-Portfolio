import nodemailer from "nodemailer";

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  body: string;
}

export function hasSmtp() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function transporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/** Branded HTML email sent to the site owner for each inquiry. */
function ownerHtml(p: ContactPayload) {
  const safe = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `
  <div style="margin:0;padding:0;background:#0b0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px">
      <div style="background:linear-gradient(135deg,#2f80ff,#9b6bff);border-radius:18px;padding:1px">
        <div style="background:#12141b;border-radius:17px;overflow:hidden">
          <div style="padding:28px 28px 18px;border-bottom:1px solid rgba(255,255,255,0.08)">
            <div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#8a93a6">Ishan OS · New message</div>
            <h1 style="margin:8px 0 0;font-size:22px;color:#f5f6f8">You've got a new inquiry ✉️</h1>
          </div>
          <div style="padding:24px 28px">
            <table style="width:100%;border-collapse:collapse;font-size:15px;color:#d6dbe3">
              <tr><td style="padding:6px 0;color:#8a93a6;width:90px">From</td><td style="padding:6px 0;font-weight:600">${safe(p.name)}</td></tr>
              <tr><td style="padding:6px 0;color:#8a93a6">Email</td><td style="padding:6px 0"><a style="color:#5aa9ff" href="mailto:${safe(p.email)}">${safe(p.email)}</a></td></tr>
              ${p.subject ? `<tr><td style="padding:6px 0;color:#8a93a6">Subject</td><td style="padding:6px 0">${safe(p.subject)}</td></tr>` : ""}
            </table>
            <div style="margin-top:18px;padding:16px;background:#0b0d12;border-radius:12px;border:1px solid rgba(255,255,255,0.06);color:#e6e9ef;font-size:15px;line-height:1.6;white-space:pre-wrap">${safe(p.body)}</div>
            <a href="mailto:${safe(p.email)}?subject=Re:%20${encodeURIComponent(p.subject || "Your message")}"
               style="display:inline-block;margin-top:22px;background:#2f80ff;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px">
              Reply to ${safe(p.name.split(" ")[0])}
            </a>
          </div>
          <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:#6a7283">
            Sent from the contact app on ishansavaliya.me
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/** Auto-reply confirmation sent to the visitor. */
function visitorHtml(p: ContactPayload) {
  const first = p.name.split(" ")[0];
  return `
  <div style="margin:0;padding:0;background:#0b0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px">
      <div style="background:#12141b;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
        <div style="padding:28px">
          <h1 style="margin:0 0 12px;font-size:22px;color:#f5f6f8">Thanks, ${first}! 👋</h1>
          <p style="color:#c2c8d4;font-size:15px;line-height:1.6">
            Your message reached Ishan. I read every note and will get back to you soon.
            In the meantime, feel free to explore my work at
            <a style="color:#5aa9ff" href="https://www.ishansavaliya.me">ishansavaliya.me</a>.
          </p>
          <p style="margin-top:20px;color:#8a93a6;font-size:14px">— Ishan Savaliya · Full-Stack Developer</p>
        </div>
      </div>
    </div>
  </div>`;
}

/* ----------------------------------------------------------- Blog emails */

export interface BlogSubmissionPayload {
  authorName: string;
  authorEmail: string;
  authorUrl: string;
  title: string;
  tags: string[];
  body: string;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Branded HTML sent to the site owner for a new blog submission. */
function blogOwnerHtml(p: BlogSubmissionPayload) {
  return `
  <div style="margin:0;padding:0;background:#0b0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px">
      <div style="background:linear-gradient(135deg,#2f80ff,#9b6bff);border-radius:18px;padding:1px">
        <div style="background:#12141b;border-radius:17px;overflow:hidden">
          <div style="padding:28px 28px 18px;border-bottom:1px solid rgba(255,255,255,0.08)">
            <div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#8a93a6">Ishan OS · Blog submission</div>
            <h1 style="margin:8px 0 0;font-size:22px;color:#f5f6f8">New post for review 📝</h1>
          </div>
          <div style="padding:24px 28px">
            <table style="width:100%;border-collapse:collapse;font-size:15px;color:#d6dbe3">
              <tr><td style="padding:6px 0;color:#8a93a6;width:90px">Author</td><td style="padding:6px 0;font-weight:600">${esc(p.authorName)}</td></tr>
              <tr><td style="padding:6px 0;color:#8a93a6">Email</td><td style="padding:6px 0"><a style="color:#5aa9ff" href="mailto:${esc(p.authorEmail)}">${esc(p.authorEmail)}</a></td></tr>
              <tr><td style="padding:6px 0;color:#8a93a6">Link</td><td style="padding:6px 0"><a style="color:#5aa9ff" href="${esc(p.authorUrl)}">${esc(p.authorUrl)}</a></td></tr>
              <tr><td style="padding:6px 0;color:#8a93a6">Title</td><td style="padding:6px 0;font-weight:600">${esc(p.title)}</td></tr>
              <tr><td style="padding:6px 0;color:#8a93a6">Tags</td><td style="padding:6px 0">${esc(p.tags.join(", ") || "Community")}</td></tr>
            </table>
            <div style="margin-top:18px;padding:16px;background:#0b0d12;border-radius:12px;border:1px solid rgba(255,255,255,0.06);color:#e6e9ef;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(p.body)}</div>
            <a href="https://www.ishansavaliya.me/is-control-portal/blogs"
               style="display:inline-block;margin-top:22px;background:#2f80ff;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px">
              Review &amp; publish
            </a>
          </div>
          <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:#6a7283">
            Sent from the blog app on ishansavaliya.me
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/** Auto-reply confirmation sent to the blog author. */
function blogAuthorHtml(p: BlogSubmissionPayload) {
  const first = p.authorName.split(" ")[0];
  return `
  <div style="margin:0;padding:0;background:#0b0d12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px">
      <div style="background:#12141b;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
        <div style="padding:28px">
          <h1 style="margin:0 0 12px;font-size:22px;color:#f5f6f8">Thanks, ${esc(first)}! 📝</h1>
          <p style="color:#c2c8d4;font-size:15px;line-height:1.6">
            Your post <strong style="color:#f5f6f8">"${esc(p.title)}"</strong> was received and is
            pending review. If approved, it'll appear on
            <a style="color:#5aa9ff" href="https://www.ishansavaliya.me/blog">ishansavaliya.me/blog</a>
            with full credit linking to your profile. I'll be in touch.
          </p>
          <p style="margin-top:20px;color:#8a93a6;font-size:14px">— Ishan Savaliya · Full-Stack Developer</p>
        </div>
      </div>
    </div>
  </div>`;
}

export async function sendBlogSubmissionEmails(p: BlogSubmissionPayload) {
  if (!hasSmtp()) return { sent: false as const };
  const t = transporter();
  const to = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER!;

  await t.sendMail({
    from: `"Ishan OS" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: p.authorEmail,
    subject: `📝 Blog submission for review: ${p.title}`,
    html: blogOwnerHtml(p),
  });

  try {
    await t.sendMail({
      from: `"Ishan Savaliya" <${process.env.GMAIL_USER}>`,
      to: p.authorEmail,
      subject: "Thanks for your blog submission 📝",
      html: blogAuthorHtml(p),
    });
  } catch {
    /* ignore auto-reply failures */
  }

  return { sent: true as const };
}

export async function sendContactEmails(p: ContactPayload) {
  if (!hasSmtp()) return { sent: false, reason: "smtp-not-configured" as const };
  const t = transporter();
  const to = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER!;

  await t.sendMail({
    from: `"Ishan OS" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: p.email,
    subject: `📨 New message from ${p.name}${p.subject ? ` — ${p.subject}` : ""}`,
    html: ownerHtml(p),
  });

  // Best-effort auto-reply; don't fail the request if it bounces.
  try {
    await t.sendMail({
      from: `"Ishan Savaliya" <${process.env.GMAIL_USER}>`,
      to: p.email,
      subject: "Thanks for reaching out 👋",
      html: visitorHtml(p),
    });
  } catch {
    /* ignore auto-reply failures */
  }

  return { sent: true as const };
}
