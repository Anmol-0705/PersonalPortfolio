"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { deleteSocialLink } from "@/lib/admin/social-link-actions";

export type DeleteSocialLinkButtonProps = {
  id: string;
  label: string;
};

export function DeleteSocialLinkButton({ id, label }: DeleteSocialLinkButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteSocialLink(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${label}`}
        className="inline-flex items-center gap-2 neo-border bg-surface-raised px-3 py-2 font-sans text-sm font-semibold uppercase tracking-wide text-hot-pink transition-colors hover:bg-surface focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Delete Social Link">
        <p className="font-sans text-sm text-muted">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-foreground">{label}</span>? This
          cannot be undone.
        </p>

        {error && (
          <p role="alert" className="mt-3 font-sans text-sm text-hot-pink">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={neoButtonClasses("secondary")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={neoButtonClasses(
              "secondary",
              "text-hot-pink! hover:bg-hot-pink! hover:text-pure-black!",
            )}
          >
            {isPending ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </Modal>
    </>
  );
}
