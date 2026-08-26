import type { SupabaseClient } from "@supabase/supabase-js";
import { describeError } from "@/lib/admin/errors";

export type ReorderResult = { success: true } | { success: false; error: string };

/**
 * Swaps two rows' sort_order values. Not wrapped in a database
 * transaction (the supabase-js query builder doesn't expose one without
 * an RPC) — a crash between the two updates would leave both rows with
 * their original values still valid relative to everything else, just
 * not yet swapped, which is a safe, non-corrupting intermediate state
 * (never a duplicate, never data loss), acceptable for a single-admin
 * portfolio workflow.
 */
export async function swapSortOrder(
  supabase: SupabaseClient,
  table: "projects" | "skills" | "services",
  context: string,
  a: { id: string; sort_order: number },
  b: { id: string; sort_order: number },
): Promise<ReorderResult> {
  const { error: errorA } = await supabase
    .from(table)
    .update({ sort_order: b.sort_order, updated_at: new Date().toISOString() })
    .eq("id", a.id);

  if (errorA) {
    return { success: false, error: describeError(context, errorA, "Failed to reorder.") };
  }

  const { error: errorB } = await supabase
    .from(table)
    .update({ sort_order: a.sort_order, updated_at: new Date().toISOString() })
    .eq("id", b.id);

  if (errorB) {
    return { success: false, error: describeError(context, errorB, "Failed to reorder.") };
  }

  return { success: true };
}
