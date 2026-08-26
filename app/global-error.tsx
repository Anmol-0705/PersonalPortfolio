"use client";

import { useEffect } from "react";

/**
 * Catches an error thrown by the root layout itself (rare — app/error.tsx
 * above handles everything else). Since the root layout may be the thing
 * that failed, this can't assume any of its providers, fonts, or globals.css
 * survived, so it renders its own minimal <html>/<body> with inline styles
 * only — no imports from components/, no design-system dependency.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          color: "#f5f1e8",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 28 + "rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "1rem", color: "#9a9a92" }}>
            The site hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              background: "#8b5cf6",
              color: "#f5f1e8",
              border: "2px solid #f5f1e8",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
