"use client";

import { useEffect } from "react";

/**
 * Warns on browser/tab close or refresh while `isDirty` is true. Does
 * not attempt to intercept Next.js App Router navigation — there's no
 * reliable, non-hacky router-level hook for that in the App Router, so
 * in-app navigation (e.g. a form's own Cancel button) should instead
 * confirm() before calling router.push() directly, which is what
 * project-form/skill-form/service-form do.
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
