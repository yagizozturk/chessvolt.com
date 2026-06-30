"use client";

import { VOLT_EXPLAIN_DIALOG_ID } from "@/components/volt-explain-dialog/volt-explain-dialog.config";
import { useVoltExplainDialog } from "@/components/volt-explain-dialog/use-volt-explain-dialog";

// Invisible mount on the user-collection page only. Runs the auto-start effect:
// if localStorage has no "seen" flag, opens the shared dialog on first visit.
// After the user closes it, localStorage blocks this effect — but sidebar
// "How Volt Works" can still open the same dialog via openDialog().
export function VoltExplainDialogAutoStart() {
  useVoltExplainDialog({ dialogId: VOLT_EXPLAIN_DIALOG_ID, autoStart: true });
  return null;
}
