import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="container-app py-12 sm:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-border pb-6">
        <p className="font-retro text-lg tracking-wide text-accent-secondary">
          {"// ADMIN"}
        </p>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
