import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Logs the real Postgrest error server-side (never swallowed — this is
 * what hid the original create-project bug), and builds a user-facing
 * message: exact detail in development, a safe generic message in
 * production so database internals never reach a browser.
 */
export function describeError(context: string, error: PostgrestError, fallback: string): string {
  console.error(`[${context}] Supabase error:`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  if (process.env.NODE_ENV !== "production") {
    return `${fallback} [DEV] ${error.code ?? "?"}: ${error.message}${error.details ? ` — ${error.details}` : ""}${error.hint ? ` (hint: ${error.hint})` : ""}`;
  }

  return fallback;
}
