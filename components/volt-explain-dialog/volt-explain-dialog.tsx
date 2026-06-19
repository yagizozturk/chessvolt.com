"use client";

import { CarouselDialog } from "@/components/carousel-dialog/carousel-dialog";
import {
  DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES,
  VOLT_EXPLAIN_DIALOG_ID,
} from "@/components/volt-explain-dialog/volt-explain-dialog.config";
import { useVoltExplainDialog } from "@/components/volt-explain-dialog/use-volt-explain-dialog";

// Renders the carousel and owns close handling (marks localStorage on dismiss).
// Mounted once in the dashboard layout so it is available from any page and from
// the sidebar. autoStart: false here — only VoltExplainDialogAutoStart on the
// collection page triggers the first-visit auto-open.
export function VoltExplainDialog() {
  const { open, onOpenChange } = useVoltExplainDialog({
    dialogId: VOLT_EXPLAIN_DIALOG_ID,
    autoStart: false,
  });

  return (
    <CarouselDialog
      open={open}
      onOpenChange={onOpenChange}
      slides={DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES}
      showSkip={false}
      titlePlacement="above-description"
    />
  );
}
