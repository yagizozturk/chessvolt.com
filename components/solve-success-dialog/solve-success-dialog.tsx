"use client";

import Lottie from "lottie-react";
import { Clock, Flame, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ColumnBasedStats } from "@/components/stats/column-based-stats";
import { NumberTickerStats } from "@/components/stats/number-ticker-stats";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShineBorder } from "@/components/ui/shine-border";
import { Spinner } from "@/components/ui/spinner";
import type { SequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import { formatAttemptDurationMs } from "@/features/user-sequence-attempt/utilities/format-attempt-duration";
import { cn } from "@/lib/utils";
import animationData from "@/public/images/animations/animation-trophy.json";

export type SolveSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  destinationPath: string;
  buttonLabel: string;
  stats?: SequenceCompleteDialogStats | null;
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
  stats,
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
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />
        <DialogHeader>
          <div className="flex flex-col items-center">
            <Lottie animationData={animationData} loop={true} autoplay={true} className="size-50" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="mt-4 text-center text-lg text-pretty">{description}</DialogDescription>
          {stats ? (
            <div className={cn("mt-4 grid grid-cols-3 gap-2")}>
              <NumberTickerStats icon={Target} label="Accuracy" value={stats.accuracyPercent} suffix="%" />
              <NumberTickerStats icon={Flame} label="Max streak" value={stats.maxCorrectStreak} />
              <ColumnBasedStats
                icon={Clock}
                label="Time"
                value={formatAttemptDurationMs(stats.durationMs) ?? "—"}
              />
            </div>
          ) : null}
        </DialogHeader>
        <DialogFooter className="mt-4 items-center justify-center sm:justify-center">
          <Button
            variant="volt"
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
