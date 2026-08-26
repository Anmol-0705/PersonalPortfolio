import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The entire /admin tree (dashboard + login) is private CMS
      // tooling behind Supabase auth — never meant to be indexed,
      // regardless of the auth gate already blocking unauthenticated
      // access at the route level.
      disallow: "/admin",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
