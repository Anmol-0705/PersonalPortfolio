"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { neoButtonClasses } from "@/components/ui/neo-button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={neoButtonClasses("secondary")}
    >
      Log Out
    </button>
  );
}
