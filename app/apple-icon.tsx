import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Matches app/icon.svg's design (dark bg, purple neo-border, "AK"
// monogram, green underline) at the larger size iOS home screens need.
// Generated via next/og's ImageResponse — bundled with Next.js, no new
// dependency.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          border: "10px solid #8b5cf6",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 84,
              color: "#f5f1e8",
              lineHeight: 1,
            }}
          >
            AK
          </div>
          <div
            style={{
              marginTop: 14,
              width: 90,
              height: 10,
              background: "#39ff14",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
