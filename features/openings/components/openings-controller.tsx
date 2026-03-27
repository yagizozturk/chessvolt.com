"use client";

import { SuccessOverlay } from "@/components/success-overlay/success-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
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

  /** Sadece bir sonraki hamlenin ply’sindeki hedef: goal.ply === activePly + 1 */
  const goalsMatchingActivePly = useMemo(() => {
    if (activePly == null) return [];
    return sortedGoals.filter((g) => g.ply === activePly + 1);
  }, [sortedGoals, activePly]);

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
          {goalsMatchingActivePly.map((goal, index) => (
            <Card key={goal.ply}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    <Target className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg">
                      <span className="flex items-center gap-2">
                        Goal {index + 1}
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
                    className="text-muted-foreground mt-0.5 shrink-0"
                    aria-hidden
                  >
                    {goal.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "min-w-0 space-y-1.5",
                      goal.isCompleted && "opacity-80",
                    )}
                  >
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p
                        className={cn(
                          "text-sm leading-snug font-semibold",
                          goal.isCompleted && "text-muted-foreground",
                        )}
                      >
                        {goal.title}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

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
