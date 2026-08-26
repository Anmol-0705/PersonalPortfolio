import { ImageResponse } from "next/og";
import { DefaultOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

// Default social-share image for every route that doesn't override it
// (project case studies override with their real cover image instead —
// see app/projects/[slug]/page.tsx's generateMetadata).
export default function Image() {
  return new ImageResponse(<DefaultOgImage />, { ...size });
}
