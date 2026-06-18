"use client";

import { useState } from "react";

import { CarouselDialog } from "@/components/carousel-dialog/carousel-dialog";
import {
  clearVoltExplainDialogSeen,
  DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES,
} from "@/components/volt-explain-dialog/volt-explain-dialog.config";
import { Button } from "@/components/ui/button";

const TEST_DIALOG_ID = "admin-preview";

export default function TestCarouselDialogPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Open carousel dialog
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => clearVoltExplainDialogSeen(TEST_DIALOG_ID)}
      >
        Clear seen state
      </Button>
      <CarouselDialog
        open={open}
        onOpenChange={setOpen}
        slides={DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES}
      />
    </div>
  );
}
