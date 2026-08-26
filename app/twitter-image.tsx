import { ImageResponse } from "next/og";
import { DefaultOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

// Same image as app/opengraph-image.tsx (Twitter/X falls back to
// Open Graph tags without this, but an explicit twitter-image keeps the
// Twitter card summary_large_image type reliable).
export default function Image() {
  return new ImageResponse(<DefaultOgImage />, { ...size });
}
