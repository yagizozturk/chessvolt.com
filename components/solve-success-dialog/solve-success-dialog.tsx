"use client";

import Lottie from "lottie-react";
import { ArrowRight, Clock, Flame, RotateCcw, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { LastAttemptVoltPoints } from "@/components/calculator/volt-calculator/last-attempt-volt-points";
import { VoltDayBreakdown } from "@/components/calculator/volt-calculator/volt-calculator";
import { VoltScoreBattery } from "@/components/calculator/volt-calculator/volt-score-battery";
import { VOLT_CONFIG } from "@/components/calculator/volt-calculator/volt.config";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { ColumnBasedStats } from "@/components/stats/column-based-stats";
import { NumberTickerStats } from "@/components/stats/number-ticker-stats";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ShineBorder } from "@/components/ui/shine-border";
import { Spinner } from "@/components/ui/spinner";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import { formatAttemptDurationMs } from "@/features/user-sequence-attempt/utilities/format-attempt-duration";
import infoAnimationData from "@/public/images/animations/animation-info-question.json";
import animationData from "@/public/images/animations/animation-trophy.json";

function VoltScoreHelp() {
  const [bestShare, secondShare, thirdShare] = VOLT_CONFIG.bestAttemptWeights.map((weight) => Math.round(weight * 100));

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring inline-flex cursor-default rounded-full focus-visible:ring-2 focus-visible:outline-none"
          aria-label="About Volt score"
        >
          <Lottie animationData={infoAnimationData} loop autoplay className="size-9" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="end" className="w-80">
        <div className="flex flex-col gap-2">
          <p className="font-medium">This is not just this solve</p>
          <p className="text-muted-foreground">
            Your Volt battery holds your last {VOLT_CONFIG.scoredDayCount} practice days from the past{" "}
            {VOLT_CONFIG.lookbackMonths} months — one cell per day.
          </p>
          <p className="text-muted-foreground">
            Solve as often as you like — your best solve of the day fills {bestShare}% of that day&apos;s cell, the
            second best {secondShare}%, and the third best {thirdShare}%. Three perfect solves fill the cell.
          </p>
          <p className="text-muted-foreground">Each solve is scored on accuracy, speed, and streak.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function AttemptStatsGrid({ stats }: { stats: MoveSequenceCompleteDialogStats }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <NumberTickerStats
        icon={Target}
        label="Accuracy"
        value={stats.accuracyPercent}
        suffix="%"
        animation
        backgroundClassName="bg-emerald-500"
      />
      <NumberTickerStats
        icon={Flame}
        label="Max streak"
        value={stats.maxCorrectStreak}
        animation
        backgroundClassName="bg-rose-500"
      />
      <ColumnBasedStats
        icon={Clock}
        label="Time"
        value={formatAttemptDurationMs(stats.durationMs) ?? "—"}
        backgroundClassName="bg-sky-500"
      />
    </div>
  );
}

export type SolveSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  destinationPath?: string | null;
  buttonLabel?: string | null;
  stats?: MoveSequenceCompleteDialogStats | null;
  voltScore?: VoltScoreResult | null;
  isVoltScoreShowing?: boolean;
  onPlayAgain?: () => void;
  onContinue?: () => void;
  footerExtra?: ReactNode;
};

export function SolveSuccessDialog({
  open,
  onOpenChange,
  title = "Congratulations!",
  destinationPath = null,
  buttonLabel = null,
  stats,
  voltScore = null,
  isVoltScoreShowing = false,
  onPlayAgain,
  onContinue,
  footerExtra,
}: SolveSuccessDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [lastAttemptCharge, setLastAttemptCharge] = useState<number | null>(null);
  const hasContinueButton = (destinationPath != null || onContinue != null) && buttonLabel != null;
  const hasVoltScore = isVoltScoreShowing || isValidVoltScore(voltScore);

  useEffect(() => {
    if (!open || isVoltScoreShowing || !isValidVoltScore(voltScore)) {
      setLastAttemptCharge(null);
    }
  }, [open, isVoltScoreShowing, voltScore]);

  const handleContinue = async () => {
    if (onContinue) {
      onContinue();
      return;
    }
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
          <DialogTitle className="text-2xl font-bold">
            {lastAttemptCharge != null ? (
              <span className="inline-flex items-center gap-1.5">
                Wow, You Charged <span className="text-primary tabular-nums">+%{lastAttemptCharge}</span>
                <Zap className="fill-primary text-primary size-6 shrink-0" aria-label="Volt" />
              </span>
            ) : (
              title
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Attempt stats (always when present; volt UI may replace this with scored metrics) */}
        {hasVoltScore ? (
          <div className="mt-4 flex flex-col gap-4">
            {isVoltScoreShowing ? (
              <div className="flex flex-col gap-4">
                {stats ? <AttemptStatsGrid stats={stats} /> : null}
                <div className="card-border-bottom-shadow flex flex-1 flex-col items-center justify-center gap-3 py-6">
                  <p className="text-muted-foreground text-center text-sm">Volt score is calculating</p>
                  <Spinner className="size-8" />
                </div>
              </div>
            ) : isValidVoltScore(voltScore) ? (
              <>
                <LastAttemptVoltPoints result={voltScore} stats={stats} onChargeGainChange={setLastAttemptCharge} />
                <div className="flex flex-col gap-4">
                  <div className="card-border-bottom-shadow relative flex flex-col items-center justify-center gap-2 px-4 py-3">
                    <p className="text-muted-foreground text-center text-sm font-medium">Total Volt Score</p>
                    <VoltScoreBattery result={voltScore} width={160} chargeLatestSolve />
                    <div className="absolute top-1 right-1 hidden sm:block">
                      <VoltScoreHelp />
                    </div>
                  </div>
                  <div className="card-border-bottom-shadow p-2">
                    <VoltDayBreakdown result={voltScore} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        ) : stats ? (
          <div className="mt-4">
            <AttemptStatsGrid stats={stats} />
          </div>
        ) : null}

        {/* Dialog Footer */}
        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:justify-center">
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
          {footerExtra ? <div className="w-full sm:w-auto">{footerExtra}</div> : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
