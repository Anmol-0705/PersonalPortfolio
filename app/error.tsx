"use client";

import { useEffect } from "react";
import Link from "next/link";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { RetroWindow } from "@/components/ui/retro-window";

/**
 * Route-level error boundary for the public site (everything under
 * app/ outside admin's own error handling). Catches render/fetch
 * errors in any public page and shows a friendly, on-brand fallback
 * instead of Next's default error screen — never the error's message,
 * stack, or any Supabase/Resend error detail, which could leak
 * implementation details to a visitor.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Errors are already reported to the server console by the code that
    // threw them (see the project's established pattern in lib/projects.ts
    // etc.) — this just keeps a client-side trace for local debugging.
    console.error("[public route error boundary]", error);
  }, [error]);

  return (
    <div className="container-app flex min-h-[calc(100dvh-4rem-1px)] items-center py-16">
      <RetroWindow title="error.exe" className="mx-auto max-w-lg">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-4 font-sans text-muted">
          This page hit an unexpected error. It&rsquo;s not something you
          did — try again, or head back to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={neoButtonClasses("primary")}>
            Try Again
          </button>
          <Link href="/" className={neoButtonClasses("secondary")}>
            Back to Home
          </Link>
        </div>
      </RetroWindow>
    </div>
  );
}
