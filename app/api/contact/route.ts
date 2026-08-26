import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/contact-email";
import type { ContactApiResponse, ContactRequestPayload } from "@/types/contact";
import type { QuoteContext } from "@/types/quote";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENGAGEMENT_TYPES = new Set(["quick-sprint", "full-build"]);

/**
 * Lightweight in-memory rate limit: one submission per IP per window.
 * Resets on server restart / cold start and isn't shared across serverless
 * instances — a deliberate "lightweight guard," not a production spam
 * defense. Documented in docs/PROJECT_STATE.md.
 */
const RATE_LIMIT_WINDOW_MS = 15_000;
const lastSubmissionByIp = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = lastSubmissionByIp.get(ip);
  if (last && now - last < RATE_LIMIT_WINDOW_MS) return true;
  lastSubmissionByIp.set(ip, now);
  return false;
}

function isQuoteContext(value: unknown): value is QuoteContext {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (!ENGAGEMENT_TYPES.has(record.engagementType as string)) return false;
  if (typeof record.estimate !== "object" || record.estimate === null) return false;
  const estimate = record.estimate as Record<string, unknown>;
  return typeof estimate.headline === "string" && typeof estimate.message === "string";
}

type ValidationResult =
  | { valid: true; data: ContactRequestPayload }
  | { valid: false; error: string };

function validatePayload(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { valid: false, error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;

  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const message = typeof record.message === "string" ? record.message.trim() : "";
  const company = typeof record.company === "string" ? record.company.trim() : "";
  const website = typeof record.website === "string" ? record.website.trim() : "";

  // Honeypot: real users never populate this field. Reject quietly.
  if (website) {
    return { valid: false, error: "Submission rejected." };
  }

  if (!name || name.length > 200) {
    return { valid: false, error: "A valid name is required." };
  }
  if (!email || email.length > 320 || !EMAIL_PATTERN.test(email)) {
    return { valid: false, error: "A valid email address is required." };
  }
  if (!message || message.length > 5000) {
    return {
      valid: false,
      error: "A message between 1 and 5000 characters is required.",
    };
  }
  if (company.length > 200) {
    return { valid: false, error: "Company name is too long." };
  }

  const quote = isQuoteContext(record.quote) ? record.quote : undefined;

  return {
    valid: true,
    data: { name, email, message, company: company || undefined, quote },
  };
}

export async function POST(
  request: Request,
): Promise<NextResponse<ContactApiResponse>> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Please wait a moment before submitting again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const validation = validatePayload(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 },
    );
  }

  const result = await sendContactEmail(validation.data);

  if (!result.ok) {
    const status = result.reason === "missing-config" ? 500 : 502;
    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while sending your request. Please try again or contact me directly by email.",
      },
      { status },
    );
  }

  return NextResponse.json({ success: true });
}
