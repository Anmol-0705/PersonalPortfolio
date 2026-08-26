import { CheckCircle2, Circle, Star, ImageIcon, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeClass =
  "inline-flex items-center gap-1.5 neo-border px-2 py-1 font-retro text-sm tracking-wide";

/**
 * Every badge pairs an icon + text label — status is never conveyed by
 * color alone (a11y requirement).
 */
export function PublishedBadge({ published }: { published: boolean }) {
  const Icon = published ? CheckCircle2 : Circle;
  return (
    <span
      className={cn(badgeClass, published ? "bg-crt-green text-pure-black" : "bg-surface-raised text-muted")}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className={cn(badgeClass, "bg-cyber-yellow text-pure-black")}>
      <Star className="h-3.5 w-3.5" aria-hidden="true" />
      Featured
    </span>
  );
}

export function EnabledBadge({ enabled }: { enabled: boolean }) {
  const Icon = enabled ? CheckCircle2 : Circle;
  return (
    <span
      className={cn(badgeClass, enabled ? "bg-crt-green text-pure-black" : "bg-surface-raised text-muted")}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}

export function ImageStatusBadge({ hasImage }: { hasImage: boolean }) {
  const Icon = hasImage ? ImageIcon : ImageOff;
  return (
    <span
      className={cn(badgeClass, hasImage ? "bg-electric-blue text-pure-black" : "bg-surface-raised text-muted")}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {hasImage ? "Image Ready" : "No Image"}
    </span>
  );
}
