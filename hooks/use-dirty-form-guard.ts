"use client";

import { useEffect } from "react";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { useUnsavedChangesContext } from "@/components/admin/unsaved-changes-provider";

/**
 * Full unsaved-changes protection for one admin form: registers `isDirty`
 * into the shared UnsavedChangesProvider (so AdminNav's GuardedLinks and any
 * other admin chrome can see it), keeps the existing beforeunload warning
 * for tab close/refresh, and guards the browser back/forward buttons.
 *
 * Back/forward guard: while dirty, a sentinel history entry is pushed on
 * top of the current page. The first Back press only consumes that
 * sentinel (the URL doesn't change, so no real navigation happens) and
 * triggers the shared "Discard unsaved changes?" dialog. Confirming
 * discard replays the Back (or Forward) the admin actually intended;
 * choosing Stay re-arms the sentinel. This can't distinguish Back from
 * Forward, and pushing the sentinel clears any existing forward history —
 * documented, accepted limitation, since the App Router has no built-in
 * navigation-blocking API to intercept this natively.
 */
export function useDirtyFormGuard(isDirty: boolean) {
  useUnsavedChangesWarning(isDirty);

  const { setDirty, isDirtyRef, confirmDiscard } = useUnsavedChangesContext();

  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState({ __unsavedGuard: true }, "", window.location.href);

    function handlePopState() {
      if (!isDirtyRef.current) return;

      confirmDiscard(
        () => {
          window.history.back();
        },
        () => {
          window.history.pushState({ __unsavedGuard: true }, "", window.location.href);
        },
      );
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty, isDirtyRef, confirmDiscard]);
}
