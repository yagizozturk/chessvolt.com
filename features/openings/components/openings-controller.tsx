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
import { getPlyFromPgnAtFen } from "@/lib/chess/getFenFromPgnAtPly";
import { cn } from "@/lib/utilities/cn";
import { Check, CheckCircle2, Circle, Lightbulb, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [lastUserUci, setLastUserUci] = useState<string | null>(null);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();

  const sortedGoals = useMemo(() => {
    const g = variant.goals;
    if (!g?.length) return [];
    return [...g].sort((a, b) => a.ply - b.ply);
  }, [variant.goals]);

  const isHighlightedGoal = (goal: OpeningVariantGoal) =>
    activePly != null && goal.ply === activePly + 1;

  useEffect(() => {
    setHintCount(0);
    setLastUserUci(null);
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

  const handleUserMovePlayed = (uci: string) => {
    setLastUserUci(uci);
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
            mode="opening"
            initialFen={variant.initialFen ?? undefined}
            moves={variant.moves}
            width={600}
            height={600}
            className="border-muted rounded-xl border-4"
            viewOnly={false}
            onUserMovePlayed={handleUserMovePlayed}
            onFenAfterUserMove={handleFenAfterUserMove}
            onFenAfterOpponentMove={handleFenAfterOpponentMove}
            onSolved={handleSolved}
            onHintUsed={setHintCount}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            {sortedGoals.map((goal, index) => {
              const highlighted = isHighlightedGoal(goal);

              if (highlighted) {
                return (
                  <Card
                    key={goal.ply}
                    className="border-primary/35 ring-primary/15 shadow-md ring-2"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                          <Target className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg">
                            <span className="flex min-w-0 flex-wrap items-baseline gap-2">
                              <span className="min-w-0">{goal.title}</span>
                            </span>
                            {lastUserUci === goal.move ? (
                              <span
                                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 text-white shadow-md ring-2 shadow-emerald-500/35 ring-emerald-300/60 dark:from-emerald-500 dark:via-emerald-600 dark:to-teal-700 dark:shadow-emerald-900/50 dark:ring-emerald-400/40"
                                aria-hidden
                              >
                                <Check
                                  className="h-4 w-4 drop-shadow-sm"
                                  strokeWidth={2.75}
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
                            goal.isCompleted && "opacity-80",
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
