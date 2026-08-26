"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoveButtons } from "@/components/admin/move-buttons";
import { moveSocialLink } from "@/lib/admin/social-link-actions";

export function SocialLinkMoveButtons({
  id,
  label,
  canMoveUp,
  canMoveDown,
}: {
  id: string;
  label: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <MoveButtons
        itemLabel={label}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMove={async (direction) => {
          const result = await moveSocialLink(id, direction);
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
