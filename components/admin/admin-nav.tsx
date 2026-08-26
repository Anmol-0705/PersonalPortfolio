import { GuardedLink } from "@/components/admin/guarded-link";
import { cn } from "@/lib/utils";

export type AdminNavSection = "dashboard" | "projects" | "skills" | "services";

const LINKS: { section: AdminNavSection; href: string; label: string }[] = [
  { section: "dashboard", href: "/admin", label: "Dashboard" },
  { section: "projects", href: "/admin/projects", label: "Projects" },
  { section: "skills", href: "/admin/skills", label: "Skills" },
  { section: "services", href: "/admin/services", label: "Services" },
];

export function AdminNav({ current }: { current: AdminNavSection }) {
  return (
    <nav aria-label="Admin sections" className="flex flex-wrap gap-2">
      {LINKS.map((link) => (
        <GuardedLink
          key={link.section}
          href={link.href}
          aria-current={link.section === current ? "page" : undefined}
          className={cn(
            "neo-border px-4 py-2 font-sans text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2",
            link.section === current
              ? "bg-accent text-off-white"
              : "bg-surface-raised hover:bg-surface",
          )}
        >
          {link.label}
        </GuardedLink>
      ))}
    </nav>
  );
}
