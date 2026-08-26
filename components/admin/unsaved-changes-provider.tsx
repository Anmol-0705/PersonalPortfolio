"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { neoButtonClasses } from "@/components/ui/neo-button";

type PendingDiscard = {
  onDiscard: () => void;
  onStay?: () => void;
};

type UnsavedChangesContextValue = {
  /** Synchronous read of the current dirty state — safe to check inside a click handler. */
  isDirtyRef: React.MutableRefObject<boolean>;
  /** Forms call this (via useDirtyFormGuard) to register/clear their dirty state. */
  setDirty: (dirty: boolean) => void;
  /**
   * Requests the shared "Discard unsaved changes?" dialog. `onDiscard` runs
   * (and the shared dirty flag is cleared) only if the admin confirms;
   * `onStay` runs if they cancel, so a caller can re-arm any guard it set up.
   */
  confirmDiscard: (onDiscard: () => void, onStay?: () => void) => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const isDirtyRef = useRef(false);
  const [pending, setPending] = useState<PendingDiscard | null>(null);

  const setDirty = useCallback((dirty: boolean) => {
    isDirtyRef.current = dirty;
  }, []);

  const confirmDiscard = useCallback((onDiscard: () => void, onStay?: () => void) => {
    setPending({ onDiscard, onStay });
  }, []);

  function handleStay() {
    const action = pending;
    setPending(null);
    action?.onStay?.();
  }

  function handleDiscard() {
    const action = pending;
    setPending(null);
    isDirtyRef.current = false;
    action?.onDiscard();
  }

  return (
    <UnsavedChangesContext.Provider value={{ isDirtyRef, setDirty, confirmDiscard }}>
      {children}
      <Modal open={pending !== null} onClose={handleStay} title="Discard unsaved changes?">
        <div className="flex flex-col gap-4">
          <p className="font-sans text-sm">
            You have unsaved changes. If you leave this page, your changes will be lost.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleStay} className={neoButtonClasses("secondary")}>
              Stay
            </button>
            <button type="button" onClick={handleDiscard} className={neoButtonClasses("primary")}>
              Discard Changes
            </button>
          </div>
        </div>
      </Modal>
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesContext() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useUnsavedChangesContext must be used within an UnsavedChangesProvider");
  }
  return context;
}
