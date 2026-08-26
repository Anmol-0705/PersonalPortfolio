"use client";

import { useRetroPreferences } from "@/components/retro/retro-preferences-provider";

/** Whether the opt-in CRT scanline overlay is enabled, and a setter. */
export function useCrtMode() {
  const { crt, setCrt } = useRetroPreferences();
  return [crt, setCrt] as const;
}
