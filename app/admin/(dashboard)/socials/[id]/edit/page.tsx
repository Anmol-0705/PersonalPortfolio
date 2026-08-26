import type { Metadata } from "next";
import Link from "next/link";
import { SocialLinkForm } from "@/components/admin/social-link-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { getSocialLinkById } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "Edit Social Link",
  robots: { index: false, follow: false },
};

export default async function EditSocialLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const socialLink = await getSocialLinkById(id);

  if (!socialLink) {
    return (
      <div className="flex flex-col gap-6">
        <AdminNav current="socials" />
        <h1 className="font-sans text-3xl font-bold">Social Link Not Found</h1>
        <NeoCard>
          <p className="font-sans text-muted">
            No social link exists for id <code>{id}</code>. It may have
            been deleted, or the link may be stale.
          </p>
          <Link href="/admin/socials" className={neoButtonClasses("primary", "mt-4")}>
            Back to Social Links
          </Link>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="socials" />
      <h1 className="font-sans text-3xl font-bold">Edit Social Link</h1>
      <SocialLinkForm mode="edit" socialLink={socialLink} />
    </div>
  );
}
