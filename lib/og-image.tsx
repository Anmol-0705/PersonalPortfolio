import { siteConfig } from "@/data/site-config";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Shared JSX for the site's default Open Graph / Twitter share image,
 * rendered by both app/opengraph-image.tsx and app/twitter-image.tsx via
 * next/og's ImageResponse. Real site data only (name/role from
 * data/site-config.ts) — no fabricated metrics or claims.
 */
export function DefaultOgImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#111111",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "monospace",
          fontSize: 28,
          color: "#39ff14",
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 999, background: "#39ff14" }} />
        SYSTEM ONLINE
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: 72,
          lineHeight: 1.1,
          color: "#f5f1e8",
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: "sans-serif",
          fontSize: 36,
          color: "#9a9a92",
        }}
      >
        {siteConfig.role}
      </div>
      <div
        style={{
          marginTop: 48,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ width: 64, height: 64, border: "5px solid #8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 28, color: "#f5f1e8" }}>
          AK
        </div>
      </div>
    </div>
  );
}
