import { createClient } from "@/lib/supabase/server";

/**
 * Shared by every admin Server Action. Extracted from project-actions.ts
 * in Phase 9 so skill/service actions don't triplicate this exact
 * security check — a mismatch between copies is exactly the kind of bug
 * this project has already hit once (the missing anon GRANT).
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[requireAdmin] no authenticated user", userError?.message);
    return { supabase, ok: false as const };
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    console.error("[requireAdmin] is_admin() returned falsy", {
      isAdmin,
      rpcError: rpcError?.message,
      userId: user.id,
    });
    return { supabase, ok: false as const };
  }

  return { supabase, ok: true as const };
}
