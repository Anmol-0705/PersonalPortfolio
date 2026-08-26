import type { Metadata } from "next";
import { SocialLinkForm } from "@/components/admin/social-link-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAllSocialLinks } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "New Social Link",
  robots: { index: false, follow: false },
};

export default async function NewSocialLinkPage() {
  const socialLinks = await getAllSocialLinks();

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="socials" />
      <h1 className="font-sans text-3xl font-bold">New Social Link</h1>
      <SocialLinkForm mode="create" nextSortOrder={socialLinks.length} />
    </div>
  );
}
