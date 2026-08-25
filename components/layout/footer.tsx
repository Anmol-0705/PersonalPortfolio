import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-[3px] border-border bg-background">
      <div className="container-app flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-sm font-semibold">{siteConfig.name}</p>
          <p className="font-retro text-base text-muted">
            {siteConfig.role} &middot; {siteConfig.location}
          </p>
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
