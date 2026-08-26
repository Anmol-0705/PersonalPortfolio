import type { QuoteContext } from "@/types/quote";

/** Payload the client sends to POST /api/contact. */
export type ContactRequestPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  quote?: QuoteContext;
  /** Honeypot field. Must arrive empty — populated means a bot filled it in. */
  website?: string;
};

export type ContactApiResponse =
  | { success: true }
  | { success: false; error: string };
