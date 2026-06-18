"use client";

import { CarouselDialog } from "@/components/carousel-dialog/carousel-dialog";
import {
  DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES,
  VOLT_EXPLAIN_DIALOG_ID,
} from "@/components/volt-explain-dialog/volt-explain-dialog.config";
import { useVoltExplainDialog } from "@/components/volt-explain-dialog/use-volt-explain-dialog";

export function VoltExplainDialog() {
  const { open, onOpenChange } = useVoltExplainDialog({ dialogId: VOLT_EXPLAIN_DIALOG_ID });

  return (
    <CarouselDialog
      open={open}
      onOpenChange={onOpenChange}
      slides={DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES}
    />
  );
}
