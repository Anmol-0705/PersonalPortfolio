import type { Metadata } from "next";
import { RetroWindow } from "@/components/ui/retro-window";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="container-app flex min-h-[70dvh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <RetroWindow title="admin-login.exe">
          <LoginForm />
        </RetroWindow>
      </div>
    </div>
  );
}
