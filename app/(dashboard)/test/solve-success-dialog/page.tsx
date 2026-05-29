"use client";

import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
        description="You found the best move. Continue to the next challenge when you are ready."
        destinationPath="/test/sonner"
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
