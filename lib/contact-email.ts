import { Resend } from "resend";
import { summarizeProject, summarizeQuickSprint } from "@/lib/quote-estimator";
import { siteConfig } from "@/data/site-config";
import type { ContactRequestPayload } from "@/types/contact";

/**
 * Server-only. Imports the Resend SDK and reads secret env vars — must
 * only ever be imported from a server context (the /api/contact route
 * handler), never from a "use client" file.
 */

export type SendContactEmailResult =
  | { ok: true }
  | { ok: false; reason: "missing-config" | "send-failed" };

function buildSubject(payload: ContactRequestPayload): string {
  if (!payload.quote) return "New Portfolio Contact Request";
  return payload.quote.engagementType === "quick-sprint"
    ? "New Portfolio Quote Request — Quick Sprint"
    : "New Portfolio Quote Request — Full Build";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEngagementLines(payload: ContactRequestPayload): string[] {
  const { quote } = payload;
  if (!quote) return [];

  const lines = [
    `Engagement model: ${
      quote.engagementType === "quick-sprint" ? "Quick Sprint" : "Full Build"
    }`,
  ];

  if (quote.quickSprint) lines.push(...summarizeQuickSprint(quote.quickSprint));
  if (quote.project) lines.push(...summarizeProject(quote.project));

  lines.push(`Guidance: ${quote.estimate.headline} ${quote.estimate.message}`);
  if (quote.estimate.indicativeEstimate) {
    lines.push(quote.estimate.indicativeEstimate);
  }

  return lines;
}

function buildTextBody(payload: ContactRequestPayload): string {
  const engagementLines = buildEngagementLines(payload);

  return [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    "",
    ...(engagementLines.length ? [...engagementLines, ""] : []),
    "Message:",
    payload.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

function buildHtmlBody(payload: ContactRequestPayload): string {
  const engagementLines = buildEngagementLines(payload);

  const engagementSection = engagementLines.length
    ? `<h2 style="font-size:16px;margin:24px 0 8px;">Engagement Details</h2>
       <ul style="padding-left:20px;margin:0;">
         ${engagementLines
           .map((line) => `<li style="margin-bottom:4px;">${escapeHtml(line)}</li>`)
           .join("")}
       </ul>`
    : "";

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;">
    <h1 style="font-size:18px;margin:0 0 16px;">New request from the portfolio site</h1>
    <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.company ? `<p style="margin:0 0 4px;"><strong>Company:</strong> ${escapeHtml(payload.company)}</p>` : ""}
    ${engagementSection}
    <h2 style="font-size:16px;margin:24px 0 8px;">Message</h2>
    <p style="white-space:pre-wrap;margin:0;">${escapeHtml(payload.message)}</p>
  </div>`;
}

export async function sendContactEmail(
  payload: ContactRequestPayload,
): Promise<SendContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || siteConfig.email;

  if (!apiKey || !fromEmail) {
    console.error(
      "[contact-email] Missing RESEND_API_KEY or RESEND_FROM_EMAIL — email not sent.",
    );
    return { ok: false, reason: "missing-config" };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: payload.email,
      subject: buildSubject(payload),
      html: buildHtmlBody(payload),
      text: buildTextBody(payload),
    });

    if (error) {
      console.error("[contact-email] Resend returned an error:", error.message);
      return { ok: false, reason: "send-failed" };
    }

    return { ok: true };
  } catch (err) {
    console.error(
      "[contact-email] Unexpected failure sending email:",
      err instanceof Error ? err.message : err,
    );
    return { ok: false, reason: "send-failed" };
  }
}
