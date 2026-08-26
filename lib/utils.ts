type ClassValue = string | number | null | false | undefined;

/**
 * Joins class names, dropping falsy values. Intentionally minimal (no
 * Tailwind-conflict resolution) to avoid pulling in clsx/tailwind-merge
 * for a need this small.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
