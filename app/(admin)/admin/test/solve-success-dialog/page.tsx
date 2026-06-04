"use client";

import { useState } from "react";

import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";

export default function TestSolveSuccessDialogPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Open success dialog
      </Button>
      <SolveSuccessDialog
        open={open}
        onOpenChange={setOpen}
        title="Completed"
        description="You found the best move. Continue to the next collection when you are ready."
        destinationPath="/admin/test/sonner"
        buttonLabel="Continue"
        stats={{
          accuracyPercent: 92,
          maxCorrectStreak: 5,
          durationMs: 84_000,
        }}
      />
    </div>
  );
}
