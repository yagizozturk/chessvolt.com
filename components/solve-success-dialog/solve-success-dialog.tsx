// TODO: Refactor
"use client";

import Lottie from "lottie-react";
import { ArrowRight, Clock, Flame, RotateCcw, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import { formatAttemptDurationMs } from "@/features/user-sequence-attempt/utilities/format-attempt-duration";
import { cn } from "@/lib/utils";
import animationData from "@/public/images/animations/animation-trophy.json";
import infoAnimationData from "@/public/images/animations/info.json";

export type SolveSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  destinationPath: string;
  buttonLabel: string;
  lessonsLearned?: string;
  stats?: MoveSequenceCompleteDialogStats | null;
  voltScore?: VoltScoreResult | null;
  isVoltScoreShowing?: boolean;
  onPlayAgain?: () => void;
  footerExtra?: ReactNode;
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
  lessonsLearned,
  stats,
  voltScore = null,
  isVoltScoreShowing = false,
  onPlayAgain,
  footerExtra,
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
        {lessonsLearned?.trim() ? (
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="font-semibold">Lessons Learned</p>
            <p className="text-muted-foreground mt-1 text-sm text-pretty">{lessonsLearned}</p>
          </div>
        ) : null}
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
            <div className="absolute top-0 right-28">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="focus-visible:ring-ring inline-flex cursor-default rounded-full focus-visible:ring-2 focus-visible:outline-none"
                    aria-label="About Volt score"
                  >
                    <Lottie animationData={infoAnimationData} loop={true} autoplay={true} className="size-10" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6} className="max-w-52 text-left">
                  Your Volt score is a combination of accuracy, timing, and streak. Hover on the graph to see more
                  details.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : null}
        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:justify-center">
          {footerExtra ? <div className="w-full sm:w-auto">{footerExtra}</div> : null}
          {onPlayAgain ? (
            <Button variant="voltGreen" type="button" onClick={onPlayAgain} className="w-full sm:w-auto">
              <RotateCcw data-icon="inline-start" />
              Play again
            </Button>
          ) : null}
          <Button
            variant="volt"
            type="button"
            disabled={isPending}
            onClick={handleContinue}
            className="w-full sm:w-auto"
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {buttonLabel}
            {!isPending ? <ArrowRight data-icon="inline-end" /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
