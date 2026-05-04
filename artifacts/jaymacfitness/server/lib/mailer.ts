import nodemailer, { Transporter } from "nodemailer";

const FROM_NAME = "Jay Mac Fitness";
const FROM_EMAIL = process.env.GMAIL_USER || "jaymacfitness1@gmail.com";

let _transport: Transporter | null = null;

function getTransport(): Transporter | null {
  const user = process.env.GMAIL_USER || "jaymacfitness1@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) return null;
  if (!_transport) {
    _transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return _transport;
}

export function isMailerConfigured(): boolean {
  return !!process.env.GMAIL_APP_PASSWORD;
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * Send an email via Gmail SMTP. Returns silently if the mailer isn't configured
 * (so missing creds never break user-facing flows like signup). Logs errors but
 * never throws — the caller decides whether to surface a failure.
 */
export async function sendMail(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const transport = getTransport();
  if (!transport) {
    console.warn("[mailer] GMAIL_APP_PASSWORD not set — skipping email to", args.to);
    return { ok: false, error: "mailer-not-configured" };
  }
  try {
    await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: args.to,
      replyTo: args.replyTo || FROM_EMAIL,
      subject: args.subject,
      text: args.text,
      html: args.html,
      // Help with deliverability / unsubscribe expectations.
      headers: {
        "X-Mailer": "JayMacFitness",
      },
    });
    return { ok: true };
  } catch (err: any) {
    console.error("[mailer] sendMail failed:", err?.message || err);
    return { ok: false, error: err?.message || "send-failed" };
  }
}

// ---------- Templates ----------

function shell(bodyHtml: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Jay Mac Fitness</title></head>
<body style="margin:0;padding:0;background:#0D1B2A;font-family:Arial,Helvetica,sans-serif;color:#e6eef7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0D1B2A;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#112240;border:1px solid #1A3A5C;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #1A3A5C;">
          <div style="font-family:'Barlow Condensed',Arial,sans-serif;font-style:italic;font-weight:900;font-size:28px;letter-spacing:1px;color:#fff;">
            JAY<span style="color:#1E90FF;">MAC</span>FITNESS
          </div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-size:15px;line-height:1.55;color:#cfdcec;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #1A3A5C;font-size:12px;color:#7d92a8;">
          Jay Mac Fitness · 07753 226 214 · <a href="mailto:jaymacfitness1@gmail.com" style="color:#1E90FF;text-decoration:none;">jaymacfitness1@gmail.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function welcomeEmail(args: { firstName: string; loginUrl: string }) {
  const html = shell(`
    <h1 style="font-family:'Barlow Condensed',Arial,sans-serif;font-style:italic;font-weight:900;font-size:32px;color:#fff;margin:0 0 12px;">WELCOME, ${escapeHtml(args.firstName.toUpperCase())}.</h1>
    <p style="margin:0 0 16px;">Thanks for creating your Jay Mac Fitness account. You're in.</p>
    <p style="margin:0 0 16px;">From your client portal you can book sessions, track your progress, and buy training packages directly through Stripe.</p>
    <p style="margin:24px 0;">
      <a href="${args.loginUrl}" style="display:inline-block;background:#1E90FF;color:#fff;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:700;letter-spacing:0.5px;">OPEN MY PORTAL</a>
    </p>
    <p style="margin:0 0 8px;">Got a question before your first session? Just hit reply — this email goes straight to Jay.</p>
    <p style="margin:24px 0 0;color:#9fb6cf;">— Jay</p>
  `);
  const text =
    `Welcome, ${args.firstName}.\n\n` +
    `Thanks for creating your Jay Mac Fitness account. You're in.\n\n` +
    `From your client portal you can book sessions, track progress, and buy training packages directly through Stripe.\n\n` +
    `Open your portal: ${args.loginUrl}\n\n` +
    `Got a question before your first session? Just reply to this email — it goes straight to Jay.\n\n— Jay`;
  return { subject: "Welcome to Jay Mac Fitness", html, text };
}

export function loginNoticeEmail(args: { firstName: string; when: Date; ip?: string }) {
  const whenStr = args.when.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const html = shell(`
    <h1 style="font-family:'Barlow Condensed',Arial,sans-serif;font-style:italic;font-weight:900;font-size:28px;color:#fff;margin:0 0 12px;">SIGNED IN.</h1>
    <p style="margin:0 0 12px;">Hi ${escapeHtml(args.firstName)} — just confirming a successful sign-in to your Jay Mac Fitness account.</p>
    <p style="margin:0 0 12px;color:#9fb6cf;">Time: ${escapeHtml(whenStr)} (UK)${args.ip ? ` · IP: ${escapeHtml(args.ip)}` : ""}</p>
    <p style="margin:16px 0 0;">If this wasn't you, reply to this email immediately and Jay will lock the account.</p>
  `);
  const text =
    `Hi ${args.firstName} — just confirming a successful sign-in to your Jay Mac Fitness account.\n\n` +
    `Time: ${whenStr} (UK)${args.ip ? `\nIP: ${args.ip}` : ""}\n\n` +
    `If this wasn't you, reply to this email immediately and Jay will lock the account.`;
  return { subject: "New sign-in to your Jay Mac Fitness account", html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
