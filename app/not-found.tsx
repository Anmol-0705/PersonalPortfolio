import type { Metadata } from "next";
import Link from "next/link";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { RetroWindow } from "@/components/ui/retro-window";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[calc(100dvh-4rem-1px)] items-center py-16">
      <RetroWindow title="error.exe" className="mx-auto max-w-lg">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">
          404 — Page Not Found
        </h1>
        <p className="mt-4 font-sans text-muted">
          This route doesn&rsquo;t exist. It may have been moved or never
          built.
        </p>
        <Link href="/" className={neoButtonClasses("primary", "mt-6")}>
          Back to Home
        </Link>
      </RetroWindow>
    </div>
  );
}
