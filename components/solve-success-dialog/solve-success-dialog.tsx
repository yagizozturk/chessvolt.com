"use client";

import Lottie from "lottie-react";
import { Clock, Flame, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
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
  voltScore?: VoltScoreResult | null;
  isVoltScoreShowing?: boolean;
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
  voltScore = null,
  isVoltScoreShowing = false,
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
        <div className="flex flex-col items-center">
          <Lottie animationData={animationData} loop={true} autoplay={true} className="size-50" />
        </div>
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-lg text-pretty">{description}</DialogDescription>
        </DialogHeader>
        {/* Stats */}
        {stats ? (
          <div className={cn("grid grid-cols-3 gap-2")}>
            <NumberTickerStats icon={Target} label="Accuracy" value={stats.accuracyPercent} suffix="%" />
            <NumberTickerStats icon={Flame} label="Max streak" value={stats.maxCorrectStreak} />
            <ColumnBasedStats icon={Clock} label="Time" value={formatAttemptDurationMs(stats.durationMs) ?? "—"} />
          </div>
        ) : null}
        {/* Volt score */}
        {isVoltScoreShowing ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <p className="text-muted-foreground text-sm">Volt score is calculating</p>
            <Spinner className="size-8" />
          </div>
        ) : isValidVoltScore(voltScore) ? (
          <div className="relative flex min-h-30 justify-center">
            <div className="absolute top-[-30px] left-24">
              <VoltCalculator result={voltScore} chartSize={200} />
            </div>
          </div>
        ) : null}
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
