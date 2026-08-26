"use client";

import { useRetroPreferences } from "@/components/retro/retro-preferences-provider";

/**
 * Opt-in UI sound effects. The AudioContext is created lazily on first
 * `playClick`/`playToggle` call (never on mount), so nothing touches audio
 * before a user gesture. Both functions silently no-op when sound is
 * disabled or the Web Audio API is unavailable.
 */
export function useSound() {
  const { sound, setSound, playClick, playToggle } = useRetroPreferences();
  return { enabled: sound, setEnabled: setSound, playClick, playToggle };
}
