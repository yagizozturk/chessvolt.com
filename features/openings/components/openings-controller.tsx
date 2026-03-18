"use client";

import { CountdownTimer } from "@/components/countdown-timer/countdown-timer";
import { ProgressStatsCard } from "@/components/stats/progress-stats-card";
import { SuccessOverlay } from "@/components/success-overlay/success-overlay";
import { Button } from "@/components/ui/button";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { CHALLENGE_COUNTDOWN_MINUTES } from "@/lib/shared/constants/challenge";
import { Clock, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function OpeningsController({
  variant,
  openingName,
  nextVariantId,
  parentOpeningUrl = "/openings",
  progressPercentage = 0,
}: {
  variant: OpeningVariant;
  openingName?: string;
  nextVariantId?: string | null;
  parentOpeningUrl?: string;
  progressPercentage?: number;
}) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [hintCount, setHintCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();

  useEffect(() => {
    setHintCount(0);
    startTimeRef.current = Date.now();
  }, [variant.id]);

  // ======================================================================
  // If there is another unsolved variant, go to that page
  // If all the variants are solved, return to main opening page
  // ======================================================================
  const handleSolved = async (isCorrect: boolean) => {
    await updateOpeningVariantAnswerHook(variant.id, isCorrect);
    if (isCorrect) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsedSeconds(Math.round(elapsed));
      setShowCorrect(true);
      setTimeout(() => {
        if (nextVariantId) {
          router.push(`/openings/variant/${nextVariantId}`);
        } else {
          router.push(parentOpeningUrl);
        }
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-8 py-6">
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        <div key={variant.id} className="relative min-w-0">
          <SuccessOverlay
            show={showCorrect}
            elapsedSeconds={elapsedSeconds}
          />
          <VoltBoard
            ref={boardRef}
            sourceId={variant.id}
            mode="opening"
            initialFen={variant.initialFen ?? undefined}
            moves={variant.moves}
            width={600}
            height={600}
            viewOnly={false}
            onSolved={handleSolved}
            onHintUsed={setHintCount}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="border-border bg-muted/50 flex items-center justify-center gap-6 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Clock className="text-primary h-5 w-5" />
              <CountdownTimer
                key={variant.id}
                minutes={CHALLENGE_COUNTDOWN_MINUTES}
                className="text-foreground text-2xl font-bold"
              />
            </div>
          </div>
          <ProgressStatsCard
            percentage={progressPercentage}
            label="Solved variants"
            className="w-full"
          />

          <div className="border-border bg-muted/50 flex flex-col gap-1 rounded-lg border p-4">
            <p className="text-muted-foreground text-xs font-medium">
              {openingName}
            </p>
            <p className="text-foreground font-semibold">
              {variant.title || "Untitled Variant"}
            </p>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full"
            disabled={hintCount >= 2}
            onClick={() => boardRef.current?.showHint()}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Hint
          </Button>
        </div>
      </div>
    </div>
  );
}
