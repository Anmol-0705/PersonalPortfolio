"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { setProjectPublished } from "@/lib/admin/project-actions";

export type PublishToggleButtonProps = {
  id: string;
  published: boolean;
};

export function PublishToggleButton({ id, published }: PublishToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await setProjectPublished(id, !published);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={neoButtonClasses("secondary", "text-sm")}
    >
      {isPending ? "..." : published ? "Unpublish" : "Publish"}
    </button>
  );
}
