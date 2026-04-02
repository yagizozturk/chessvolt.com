"use client";

import { MoveGoal as MoveGoalView } from "@/components/move-goal/move-goal";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type {
  MoveGoal,
  OpeningVariant,
} from "@/features/openings/types/opening-variant";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { Lightbulb, Target } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function OpeningVariantController({
  variant,
  nextVariantId,
  parentOpeningUrl = "/openings",
}: {
  variant: OpeningVariant;
  nextVariantId?: string | null;
  parentOpeningUrl?: string; //TODO: Bu ne işe yarıyor kontrol et.
}) {
  const boardRef = useRef<VoltBoardHandle>(null);
  const confettiRef = useRef<ConfettiRef>(null);
  const [hintCount, setHintCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  /** PGN’e göre mevcut tahta pozisyonunun ply’si (FEN eşlemesi) */
  const [activePly, setActivePly] = useState<number | null>(() => variant.ply);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();

  const sortedGoals = useMemo(() => {
    const g = variant.goals;
    if (!g?.length) return [];
    return [...g].sort((a, b) => a.ply - b.ply);
  }, [variant.goals]);

  const isHighlightedGoal = (goal: MoveGoal) =>
    activePly != null && goal.ply === activePly + 1;

  /** activePly hedef ply’ine ulaştıysa / geçtiyse tamam (bir sonraki hedefe geçilebildiyse önceki biter) */
  const isGoalDone = (goal: MoveGoal) =>
    activePly != null && activePly >= goal.ply;

  const goalsProgress = useMemo(() => {
    const total = sortedGoals.length;
    if (total === 0) {
      return { completed: 0, total: 0, percent: 0 };
    }
    const completed = sortedGoals.filter(
      (g) => activePly != null && activePly >= g.ply,
    ).length;
    return {
      completed,
      total,
      percent: (completed / total) * 100,
    };
  }, [sortedGoals, activePly]);

  useEffect(() => {
    setHintCount(0);
    setActivePly(variant.ply);
  }, [variant.id, variant.ply]);

  useEffect(() => {
    if (!showCorrect) return;
    void confettiRef.current?.fire({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.45 },
    });
  }, [showCorrect]);

  // ======================================================================
  // If there is another unsolved variant, go to that page
  // If all the variants are solved, return to main opening page
  // ======================================================================
  const handleSolved = async (isCorrect: boolean) => {
    await updateOpeningVariantAnswerHook(variant.id, isCorrect);
    if (isCorrect) {
      setShowCorrect(true);
    }
  };

  const handleFenAfterUserMove = (fen: string) => {
    const ply = getPlyFromPgnAtFen(variant.pgn, fen);
    if (ply !== null) setActivePly(ply);
  };

  const handleFenAfterOpponentMove = (fen: string) => {
    const ply = getPlyFromPgnAtFen(variant.pgn, fen);
    if (ply !== null) setActivePly(ply);
  };

  return (
    <div className="container mx-auto max-w-5xl px-8 py-6">
      <SolveSuccessDialog
        open={showCorrect}
        onOpenChange={(open) => {
          if (!open) setShowCorrect(false);
        }}
        title="Line completed successfully"
        description={
          nextVariantId
            ? "Continue to the next variation."
            : "Return to the opening overview when you are ready."
        }
        destinationPath={
          nextVariantId != null
            ? `/openings/variant/${nextVariantId}`
            : parentOpeningUrl
        }
        buttonLabel={nextVariantId ? "Next variant" : "Back to opening"}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        {/*************** Board ***************/}
        <div key={variant.id} className="relative min-w-0">
          <Confetti
            ref={confettiRef}
            manualstart
            className="pointer-events-none absolute inset-0 z-10 size-full"
          />
          <VoltBoard
            ref={boardRef}
            sourceId={variant.id}
            initialFen={variant.initialFen ?? undefined}
            moves={variant.moves}
            width={600}
            height={600}
            className="border-muted rounded-xl border-4"
            viewOnly={false}
            onFenAfterUserMove={handleFenAfterUserMove}
            onFenAfterOpponentMove={handleFenAfterOpponentMove}
            onSolved={handleSolved}
            onHintUsed={setHintCount}
          />
        </div>

        {/*************** Move Count, Turn, Goals ***************/}
        <div className="flex min-w-0 flex-col gap-4">
          {goalsProgress.total === 0 && variant.title ? (
            <h2 className="text-foreground text-xl font-semibold tracking-tight">
              {variant.title}
            </h2>
          ) : null}

          {goalsProgress.total > 0 && (
            <Card className="gap-0 overflow-hidden py-0 shadow-sm">
              <CardHeader className="border-border bg-muted/40 gap-0 space-y-0 border-b px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <Target className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <CardTitle className="text-lg leading-snug">
                      {variant.title ?? "Opening line"}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 py-4">
                <Progress
                  className="h-2.5 w-full"
                  value={goalsProgress.percent}
                  aria-label={`Goals progress: ${goalsProgress.completed} of ${goalsProgress.total} completed`}
                />
              </CardContent>
            </Card>
          )}

          {/*
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-950/50">
              <div
                className={`h-7 w-7 shrink-0 rounded-full border-2 ${
                  turn === "White"
                    ? "border-gray-300 bg-white dark:border-gray-600"
                    : "border-gray-800 bg-black dark:border-gray-400"
                }`}
              />
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Turn
              </p>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                {turn}
              </span>
            </div>
            {moveCount > 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-950/50">
                <Puzzle className="h-7 w-7 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Moves To Find
                </p>
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {moveCount} {moveCount === 1 ? "move" : "moves"}
                </span>
              </div>
            )}
          </div>
          */}

          {/*************** Goals ***************/}
          <div className="flex flex-col gap-2">
            {sortedGoals.map((goal, index) => (
              <MoveGoalView
                key={goal.ply}
                goal={goal}
                index={index}
                highlighted={isHighlightedGoal(goal)}
                done={isGoalDone(goal)}
              />
            ))}
          </div>

          {/*************** Hint Button ***************/}
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
