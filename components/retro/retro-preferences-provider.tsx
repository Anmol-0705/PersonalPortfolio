"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

type RetroPreferences = {
  crt: boolean;
  setCrt: (value: boolean) => void;
  trail: boolean;
  setTrail: (value: boolean) => void;
  sound: boolean;
  setSound: (value: boolean) => void;
  playClick: () => void;
  playToggle: () => void;
};

const RetroPreferencesContext = createContext<RetroPreferences | null>(null);

/**
 * Single shared source of truth for the CRT / cursor-trail / sound
 * preferences. Several independent parts of the tree (the settings panel,
 * the Modal, the cursor-trail renderer) need to read and react to the same
 * booleans, so this is one context provider rather than three separate
 * localStorage subscriptions that could drift out of sync with each other.
 */
export function RetroPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [crt, setCrt] = useLocalStorage("retro-crt-enabled", false);
  const [trail, setTrail] = useLocalStorage("retro-trail-enabled", false);
  const [sound, setSound] = useLocalStorage("retro-sound-enabled", false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    document.documentElement.dataset.crt = crt ? "true" : "false";
  }, [crt]);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number) => {
      if (!sound) return;
      const context = getAudioContext();
      if (!context) return;
      if (context.state === "suspended") void context.resume();

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    },
    [sound, getAudioContext],
  );

  const playClick = useCallback(() => playTone(440, 0.05), [playTone]);
  const playToggle = useCallback(() => playTone(660, 0.08), [playTone]);

  return (
    <RetroPreferencesContext.Provider
      value={{ crt, setCrt, trail, setTrail, sound, setSound, playClick, playToggle }}
    >
      {children}
    </RetroPreferencesContext.Provider>
  );
}

export function useRetroPreferences(): RetroPreferences {
  const context = useContext(RetroPreferencesContext);
  if (!context) {
    throw new Error(
      "useRetroPreferences must be used within a RetroPreferencesProvider",
    );
  }
  return context;
}
