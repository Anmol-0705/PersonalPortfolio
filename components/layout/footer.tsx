import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { socialIconMap } from "@/lib/social-icons";
import { socialLinkHref } from "@/lib/social-link-href";
import type { SocialLink } from "@/types/social-link";

export type FooterProps = {
  socialLinks: SocialLink[];
};

export function Footer({ socialLinks }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-[3px] border-border bg-background">
      <div className="container-app flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-sm font-semibold">{siteConfig.name}</p>
          <p className="font-retro text-base text-muted">
            {siteConfig.role} &middot; {siteConfig.location}
          </p>

          {socialLinks.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((socialLink) => {
                const Icon = socialIconMap[socialLink.iconId];
                const { href, isExternal } = socialLinkHref(socialLink);
                return (
                  <li key={socialLink.id}>
                    <a
                      href={href}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      title={socialLink.label}
                      aria-label={
                        isExternal ? `${socialLink.label} (opens in a new tab)` : socialLink.label
                      }
                      className="flex h-8 w-8 items-center justify-center border-2 border-border bg-surface-raised text-muted transition-colors hover:bg-accent hover:text-off-white focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-1 sm:items-end">
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-sans text-sm underline decoration-2 underline-offset-4 hover:text-accent focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
          >
            {siteConfig.email}
          </a>
          <p className="font-retro text-base text-muted">
            &copy; {year} &middot; Built by{" "}
            <Link
              href="/"
              className="hover:text-accent focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
            >
              {siteConfig.name}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
