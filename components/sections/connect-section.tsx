import { neoButtonClasses } from "@/components/ui/neo-button";
import { SectionHeading } from "@/components/sections/section-heading";
import { socialIconMap } from "@/lib/social-icons";
import { getEnabledSocialLinks } from "@/lib/social-links";
import { socialLinkHref } from "@/lib/social-link-href";

export async function ConnectSection() {
  const socialLinks = await getEnabledSocialLinks();

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <section id="connect" className="border-b-[3px] border-border bg-surface">
      <div className="container-app py-20 sm:py-28">
        <SectionHeading
          eyebrow="// CONNECT"
          title="Find me around the internet"
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {socialLinks.map((socialLink) => {
            const Icon = socialIconMap[socialLink.iconId];
            const { href, isExternal } = socialLinkHref(socialLink);
            return (
              <a
                key={socialLink.id}
                href={href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={
                  isExternal ? `${socialLink.label} (opens in a new tab)` : socialLink.label
                }
                className={neoButtonClasses("secondary")}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {socialLink.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
