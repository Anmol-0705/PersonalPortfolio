"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useUnsavedChangesContext } from "@/components/admin/unsaved-changes-provider";

type GuardedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

/**
 * Drop-in replacement for `next/link` inside `/admin`: if the current form
 * is dirty (per UnsavedChangesProvider), clicking pauses navigation and
 * shows the shared discard-confirmation dialog instead of navigating away
 * silently. A modified click (ctrl/cmd/shift/middle-click — i.e. "open in
 * new tab") is left alone since it doesn't navigate the current page.
 */
export function GuardedLink({ href, onClick, ...props }: GuardedLinkProps) {
  const router = useRouter();
  const { isDirtyRef, confirmDiscard } = useUnsavedChangesContext();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (!isDirtyRef.current) return;

    event.preventDefault();
    confirmDiscard(() => {
      router.push(typeof href === "string" ? href : href.toString());
    });
  }

  return (
    <Link href={href} onClick={handleClick} {...props} />
  );
}
