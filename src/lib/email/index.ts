import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  if (!resend) {
    console.log("=== Email (dev mode, no RESEND_API_KEY) ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log("============================================");
    return;
  }

  await resend.emails.send({
    from: from ?? "SoloStack <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}
