"use client";

import { useRetroPreferences } from "@/components/retro/retro-preferences-provider";

/** Whether the opt-in retro cursor trail is enabled, and a setter. */
export function useCursorTrail() {
  const { trail, setTrail } = useRetroPreferences();
  return [trail, setTrail] as const;
}
