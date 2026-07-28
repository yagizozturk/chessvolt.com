"use client";

import { VOLT_EXPLAIN_DIALOG_ID } from "@/components/volt-explain-dialog/volt-explain-dialog.config";
import { useVoltExplainDialog } from "@/components/volt-explain-dialog/use-volt-explain-dialog";

type VoltExplainDialogAutoStartProps = {
  /** When set, waits until this tour is marked seen before auto-opening Volt. */
  requireTourSeenId?: string;
};

// Invisible mount on the favorites page (when user has favorites). Runs the
// auto-start effect: if localStorage has no "seen" flag, opens the shared dialog
// once eligible. After the user closes it, localStorage blocks this effect —
// but sidebar "How Volt Works" can still open the same dialog via openDialog().
export function VoltExplainDialogAutoStart({ requireTourSeenId }: VoltExplainDialogAutoStartProps) {
  useVoltExplainDialog({
    dialogId: VOLT_EXPLAIN_DIALOG_ID,
    autoStart: true,
    requireTourSeenId,
  });
  return null;
}
