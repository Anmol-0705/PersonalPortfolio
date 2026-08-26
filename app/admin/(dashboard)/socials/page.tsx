import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { NeoCard } from "@/components/ui/neo-card";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { DeleteSocialLinkButton } from "@/components/admin/delete-social-link-button";
import { SocialLinkMoveButtons } from "@/components/admin/social-link-move-buttons";
import { EnabledBadge } from "@/components/admin/status-badges";
import { socialIconMap } from "@/lib/social-icons";
import { socialPlatformLabels } from "@/lib/social-platforms";
import { getAllSocialLinks } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "Manage Social Links",
  robots: { index: false, follow: false },
};

export default async function AdminSocialsPage() {
  const socialLinks = await getAllSocialLinks();

  return (
    <div className="flex flex-col gap-6">
      <AdminNav current="socials" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-3xl font-bold">Social Links</h1>
        <Link href="/admin/socials/new" className={neoButtonClasses("primary")}>
          + Add Social Link
        </Link>
      </div>

      {socialLinks.length === 0 ? (
        <NeoCard>
          <p className="font-sans text-muted">
            No social links yet. Add your first one.
          </p>
          <Link href="/admin/socials/new" className={neoButtonClasses("primary", "mt-4")}>
            Add Social Link
          </Link>
        </NeoCard>
      ) : (
        <div className="flex flex-col gap-4">
          {socialLinks.map((socialLink, index) => {
            const Icon = socialIconMap[socialLink.iconId];
            return (
              <NeoCard
                key={socialLink.id}
                className={
                  socialLink.enabled
                    ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    : "flex flex-col gap-4 opacity-60 sm:flex-row sm:items-center sm:justify-between"
                }
              >
                <div className="flex items-center gap-4">
                  <SocialLinkMoveButtons
                    id={socialLink.id}
                    label={socialLink.label}
                    canMoveUp={index > 0}
                    canMoveDown={index < socialLinks.length - 1}
                  />
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-border bg-accent text-off-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-sans text-lg font-bold">{socialLink.label}</h2>
                    <p className="mt-1 font-sans text-sm text-muted">
                      {socialPlatformLabels[socialLink.platform]} · {socialLink.url}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <EnabledBadge enabled={socialLink.enabled} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/socials/${socialLink.id}/edit`}
                    className={neoButtonClasses("secondary", "text-sm")}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </Link>
                  <DeleteSocialLinkButton id={socialLink.id} label={socialLink.label} />
                </div>
              </NeoCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
