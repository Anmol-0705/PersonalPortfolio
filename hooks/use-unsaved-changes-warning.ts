"use client";

import { useEffect } from "react";

/**
 * Warns on browser/tab close or refresh while `isDirty` is true. This is
 * the tab-close/refresh half of unsaved-changes protection; in-app
 * navigation (AdminNav links, Cancel buttons, browser back/forward) is
 * covered separately by useDirtyFormGuard + UnsavedChangesProvider, which
 * calls this hook internally — admin forms should use useDirtyFormGuard
 * rather than calling this one directly.
 */
export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
