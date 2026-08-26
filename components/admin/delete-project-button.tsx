"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { deleteProject } from "@/lib/admin/project-actions";

export type DeleteProjectButtonProps = {
  id: string;
  title: string;
};

export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteProject(id);
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
        aria-label={`Delete ${title}`}
        className="inline-flex items-center gap-2 neo-border bg-surface-raised px-3 py-2 font-sans text-sm font-semibold uppercase tracking-wide text-hot-pink transition-colors hover:bg-surface focus-visible:[outline:3px_solid_var(--color-focus)] focus-visible:outline-offset-2"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Delete Project">
        <p className="font-sans text-sm text-muted">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-foreground">{title}</span>? This
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
