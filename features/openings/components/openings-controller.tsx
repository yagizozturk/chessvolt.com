"use client";

import { SuccessOverlay } from "@/components/success-overlay/success-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type {
  OpeningVariant,
  OpeningVariantGoal,
} from "@/features/openings/types/opening-variant";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { cn } from "@/lib/utilities/cn";
import { Check, Lightbulb, Puzzle, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

function getMoveCount(moves: string | null): number {
  if (!moves?.trim()) return 0;
  const arr = moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  return Math.ceil(arr.length / 2);
}

export default function OpeningsController({
  variant,
  nextVariantId,
  parentOpeningUrl = "/openings",
}: {
  variant: OpeningVariant;
  nextVariantId?: string | null;
  parentOpeningUrl?: string;
}) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
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

  const isHighlightedGoal = (goal: OpeningVariantGoal) =>
    activePly != null && goal.ply === activePly + 1;

  /** activePly hedef ply’ine ulaştıysa / geçtiyse tamam (bir sonraki hedefe geçilebildiyse önceki biter) */
  const isGoalDone = (goal: OpeningVariantGoal) =>
    activePly != null && activePly >= goal.ply;

  const positionFen = useMemo(() => {
    if (activePly == null) {
      return variant.displayFen ?? variant.initialFen;
    }
    return (
      getFenFromPgnAtPly(variant.pgn, activePly) ??
      variant.displayFen ??
      variant.initialFen
    );
  }, [variant.pgn, variant.displayFen, variant.initialFen, activePly]);

  const turn = (positionFen?.includes(" w ") ?? true) ? "White" : "Black";

  const moveCount = getMoveCount(variant.moves);

  useEffect(() => {
    setHintCount(0);
    setActivePly(variant.ply);
  }, [variant.id, variant.ply]);

  // ======================================================================
  // If there is another unsolved variant, go to that page
  // If all the variants are solved, return to main opening page
  // ======================================================================
  const handleSolved = async (isCorrect: boolean) => {
    await updateOpeningVariantAnswerHook(variant.id, isCorrect);
    if (isCorrect) {
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
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        <div key={variant.id} className="relative min-w-0">
          <SuccessOverlay show={showCorrect} />
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

        <div className="flex min-w-0 flex-col gap-4">
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

          <div className="flex flex-col gap-2">
            {sortedGoals.map((goal, index) => {
              const highlighted = isHighlightedGoal(goal);

              if (highlighted) {
                return (
                  <Card
                    key={goal.ply}
                    className="border-primary/35 ring-primary/15 gap-2 shadow-md ring-2"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                          <Target className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="flex flex-wrap items-center gap-x-2 text-lg">
                            <span className="min-w-0">{goal.title}</span>
                            {isGoalDone(goal) ? (
                              <span
                                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm dark:bg-emerald-500"
                                aria-label="Goal completed"
                              >
                                <Check
                                  className="h-4 w-4"
                                  strokeWidth={2.75}
                                  aria-hidden
                                />
                              </span>
                            ) : null}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-0 pt-0">
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "min-w-0 space-y-1.5",
                            isGoalDone(goal) && "opacity-80",
                          )}
                        >
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div
                  key={goal.ply}
                  className="bg-muted/35 flex min-h-10 items-center justify-between gap-2 rounded-lg border px-3 py-2"
                >
                  <span className="min-w-0 truncate text-sm font-medium">
                    Goal {index + 1}: {goal.title}
                  </span>
                  {isGoalDone(goal) ? (
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500"
                      aria-label="Goal completed"
                    >
                      <Check
                        className="h-3.5 w-3.5"
                        strokeWidth={2.75}
                        aria-hidden
                      />
                    </span>
                  ) : null}
                </div>
              );
            })}
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
