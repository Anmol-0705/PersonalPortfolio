"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-border bg-background/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-retro text-2xl leading-none focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-block rounded-none px-4 py-2 font-sans text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
                      isActive
                        ? "bg-accent text-off-white"
                        : "text-foreground hover:bg-surface",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="neo-border p-2 md:hidden focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t-[3px] border-border bg-background md:hidden"
        >
          <ul className="container-app flex flex-col py-2">
            {siteConfig.nav.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block rounded-none px-2 py-3 font-sans text-sm font-semibold uppercase tracking-wide focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
                      isActive ? "text-accent" : "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
