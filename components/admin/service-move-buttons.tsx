"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoveButtons } from "@/components/admin/move-buttons";
import { moveService } from "@/lib/admin/service-actions";

export function ServiceMoveButtons({
  id,
  title,
  canMoveUp,
  canMoveDown,
}: {
  id: string;
  title: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <MoveButtons
        itemLabel={title}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMove={async (direction) => {
          const result = await moveService(id, direction);
          if (result.success) {
            setError(null);
            router.refresh();
          } else {
            setError(result.error);
          }
          return result;
        }}
      />
      {error && (
        <p role="alert" className="max-w-32 font-sans text-xs text-hot-pink">
          {error}
        </p>
      )}
    </div>
  );
}
