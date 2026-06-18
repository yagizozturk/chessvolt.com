"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getVoltExplainDialogStorageKey,
  hasSeenVoltExplainDialog,
  markVoltExplainDialogSeen,
} from "@/components/volt-explain-dialog/volt-explain-dialog.config";

export type UseVoltExplainDialogParams = {
  dialogId: string;
  autoStart?: boolean;
};

export function useVoltExplainDialog({ dialogId, autoStart = true }: UseVoltExplainDialogParams) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoStart || typeof window === "undefined") return;
    if (hasSeenVoltExplainDialog(dialogId)) return;

    const frameId = requestAnimationFrame(() => {
      setOpen(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, [autoStart, dialogId]);

  const onOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        markVoltExplainDialogSeen(dialogId);
      }
    },
    [dialogId],
  );

  return {
    open,
    onOpenChange,
    storageKey: getVoltExplainDialogStorageKey(dialogId),
  };
}
