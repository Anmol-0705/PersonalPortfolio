"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readValue<T>(key: string, defaultValue: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * SSR-safe localStorage-backed state via useSyncExternalStore: the server
 * (and the very first client render, before hydration) always see
 * `defaultValue`; the real stored value takes over right after hydration
 * with no `setState`-in-effect and no hydration mismatch. Only used with
 * primitive (boolean) values in this codebase, where a fresh
 * `JSON.parse` per snapshot is still referentially/value-stable enough
 * for `useSyncExternalStore` to not loop.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const getSnapshot = useCallback(
    () => readValue(key, defaultValue),
    [key, defaultValue],
  );
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setStoredValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const previous = readValue(key, defaultValue);
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(previous)
          : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // storage unavailable (private mode, quota, etc.) — nothing else to do
      }
      emitChange();
    },
    [key, defaultValue],
  );

  return [value, setStoredValue] as const;
}
