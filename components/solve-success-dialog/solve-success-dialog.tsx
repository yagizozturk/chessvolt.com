"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export type SolveSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Dialog heading (e.g. “Line completed”, “Riddle solved”) */
  title?: string;
  description: string;
  /** Passed to `router.push` when the primary button is pressed */
  destinationPath: string;
  /** Primary action label */
  continueLabel: string;
};

export function SolveSuccessDialog({
  open,
  onOpenChange,
  title = "Completed",
  description,
  destinationPath,
  continueLabel,
}: SolveSuccessDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => router.push(destinationPath)}
          >
            {continueLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
