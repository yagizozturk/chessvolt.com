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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShineBorder } from "@/components/ui/shine-border";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import { formatAttemptDurationMs } from "@/features/user-sequence-attempt/utilities/format-attempt-duration";
import { cn } from "@/lib/utils";
import infoAnimationData from "@/public/images/animations/animation-info-question.json";
import animationData from "@/public/images/animations/animation-trophy.json";

export type SolveSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  destinationPath?: string | null;
  buttonLabel?: string | null;
  lessonsLearned?: string;
  stats?: MoveSequenceCompleteDialogStats | null;
  voltScore?: VoltScoreResult | null;
  isVoltScoreShowing?: boolean;
  onPlayAgain?: () => void;
  footerExtra?: ReactNode;
};

export function SolveSuccessDialog({
  open,
  onOpenChange,
  title = "Congratulations!",
  destinationPath = null,
  buttonLabel = null,
  lessonsLearned,
  stats,
  voltScore = null,
  isVoltScoreShowing = false,
  onPlayAgain,
  footerExtra,
}: SolveSuccessDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const hasContinueButton = destinationPath != null && buttonLabel != null;
  const trimmedLessons = lessonsLearned?.trim() ?? "";
  const hasLessons = trimmedLessons.length > 0;
  const hasVoltScore = isVoltScoreShowing || isValidVoltScore(voltScore);

  const handleContinue = async () => {
    if (!destinationPath) return;
    setIsPending(true);
    router.push(destinationPath);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />

        {/* Trophy Animation */}
        <div className="flex flex-col items-center">
          <Lottie animationData={animationData} loop autoplay className="size-50" />
        </div>

        {/* Dialog Header */}
        <DialogHeader className="mt-[-30px] items-center text-center">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        {/* Lessons Learned + Volt score */}
        {hasLessons || hasVoltScore ? (
          <div className="mt-4 flex gap-4">
            {/* Lessons Learned */}
            {hasLessons ? (
              <div
                className={cn(
                  "card-border-bottom-shadow justify-center p-4 text-center",
                  hasVoltScore ? "flex-2/3" : "flex-1",
                )}
              >
                <p className="font-semibold">Lessons Learned</p>
                <p className="text-muted-foreground mt-1 text-sm text-pretty">{trimmedLessons}</p>
              </div>
            ) : null}

            {/* Volt score */}
            {isVoltScoreShowing ? (
              <div
                className={cn(
                  "card-border-bottom-shadow flex flex-col items-center justify-center gap-3 py-6",
                  hasLessons ? "flex-1/3" : "flex-1",
                )}
              >
                <p className="text-muted-foreground text-center text-sm">Volt score is calculating</p>
                <Spinner className="size-8" />
              </div>
            ) : isValidVoltScore(voltScore) ? (
              <div
                className={cn(
                  "card-border-bottom-shadow relative flex min-h-30 items-center justify-center",
                  hasLessons ? "flex-1/3" : "flex-1",
                )}
              >
                <VoltCalculator result={voltScore} chartSize={150} />
                <div className="absolute top-2 right-2 hidden sm:block">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="focus-visible:ring-ring inline-flex cursor-default rounded-full focus-visible:ring-2 focus-visible:outline-none"
                        aria-label="About Volt score"
                      >
                        <Lottie animationData={infoAnimationData} loop autoplay className="size-9" />
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
          </div>
        ) : null}

        {/* Stats */}
        {stats ? (
          <div className="grid grid-cols-3 gap-2">
            <NumberTickerStats icon={Target} label="Accuracy" value={stats.accuracyPercent} suffix="%" />
            <NumberTickerStats icon={Flame} label="Max streak" value={stats.maxCorrectStreak} />
            <ColumnBasedStats icon={Clock} label="Time" value={formatAttemptDurationMs(stats.durationMs) ?? "—"} />
          </div>
        ) : null}

        {/* Dialog Footer */}
        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:justify-center">
          {footerExtra ? <div className="w-full sm:w-auto">{footerExtra}</div> : null}
          {onPlayAgain ? (
            <Button variant="voltGreen" type="button" onClick={onPlayAgain} className="w-full sm:w-auto">
              <RotateCcw data-icon="inline-start" />
              Play again
            </Button>
          ) : null}
          {hasContinueButton ? (
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
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
