"use client";

import { useCallback, useEffect } from "react";

import {
  getVoltExplainDialogStorageKey,
  hasSeenVoltExplainDialog,
  markVoltExplainDialogSeen,
} from "@/components/volt-explain-dialog/volt-explain-dialog.config";
import { useVoltExplainDialogStore } from "@/components/volt-explain-dialog/volt-explain-dialog-store";

export type UseVoltExplainDialogParams = {
  dialogId: string;
  /**
   * When true, opens the dialog on mount if the user has not seen it yet.
   * When false, only responds to openDialog() / setOpen() — used by VoltExplainDialog
   * in the layout so it never auto-pops on every dashboard page.
   */
  autoStart?: boolean;
};

// Thin wrapper for sidebar/menu actions. Calls openDialog() directly, bypassing
// hasSeenVoltExplainDialog — the user explicitly asked to see the intro again.
export function useVoltExplainMenuAction() {
  const openDialog = useVoltExplainDialogStore((state) => state.openDialog);

  return { openDialog };
}

export function useVoltExplainDialog({ dialogId, autoStart = true }: UseVoltExplainDialogParams) {
  const open = useVoltExplainDialogStore((state) => state.open);
  const setOpen = useVoltExplainDialogStore((state) => state.setOpen);
  const openDialog = useVoltExplainDialogStore((state) => state.openDialog);

  // Auto-start path: first visit only. Checked against localStorage — if the user
  // already dismissed the dialog once, this effect is a no-op on future visits.
  useEffect(() => {
    if (!autoStart || typeof window === "undefined") return;
    if (hasSeenVoltExplainDialog(dialogId)) return;

    const frameId = requestAnimationFrame(() => {
      setOpen(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, [autoStart, dialogId, setOpen]);

  const onOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      // Mark seen on any close (auto or manual). Prevents auto-start next time,
      // but does not prevent openDialog() — intentional re-opens still work.
      if (!next) {
        markVoltExplainDialogSeen(dialogId);
      }
    },
    [dialogId, setOpen],
  );

  return {
    open,
    onOpenChange,
    openDialog,
    storageKey: getVoltExplainDialogStorageKey(dialogId),
  };
}
