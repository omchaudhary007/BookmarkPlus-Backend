import { Resend } from "resend";
import { env } from "../config/env";
import crypto from "crypto";
import { EmailVerification } from "../models/EmailVerification";
import { verificationEmailTemplate } from "./mailTemplate";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  return await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export async function sendVerification(userId: string, email: string) {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await EmailVerification.deleteMany({ userId });

    await EmailVerification.create({
      userId,
      token,
      expiresAt,
    });

    const html = verificationEmailTemplate(token);

    const result = await sendEmail(email, "Verify your email", html);

    if (result.error) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
