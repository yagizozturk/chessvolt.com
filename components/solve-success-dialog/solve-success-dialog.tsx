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
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type SolveSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  destinationPath: string;
  buttonLabel: string;
};

/**
 * Refactor: ✅
 * A dialog that appears when a user solves a puzzle successfully.
 * @param open - Whether the dialog is open.
 * @param onOpenChange - A function that is called when the dialog is opened or closed.
 * @param title - The title of the dialog.
 * @param description - The description of the dialog.
 * @param destinationPath - The path to redirect to when the user clicks the button.
 * @param buttonLabel - The label of the primary button.
 */
export function SolveSuccessDialog({
  open,
  onOpenChange,
  title = "Completed",
  description,
  destinationPath,
  buttonLabel,
}: SolveSuccessDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleContinue = async () => {
    setIsPending(true);
    router.push(destinationPath);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-pretty">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleContinue}
            className="w-full sm:w-auto"
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {buttonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
