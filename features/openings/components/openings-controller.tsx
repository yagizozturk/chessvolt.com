"use client";

import { SuccessOverlay } from "@/components/success-overlay/success-overlay";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { getCommentsAndFensFromPgn } from "@/lib/chess/getCommentFromPgnAtPly";
import { highlightPgnCommentSpans } from "@/lib/chess/highlight-pgn-comment";
import type { PgnCommentRow } from "@/lib/shared/types/pgn-comment";
import { cn } from "@/lib/utilities/cn";
import { CheckCircle2, Circle, Lightbulb, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

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
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();
  // useMemo sayfa her render olduğunda karmaşık işlem tekrar yapılmasın die sonucu memory de tutar
  // PgnCommentRow hem o movedaki FEN durumunu hem de commenti içerir. Chess.js getComments() default bunları döner.
  const pgnComments: PgnCommentRow[] = useMemo(
    () => getCommentsAndFensFromPgn(variant.pgn),
    [variant.pgn, variant.id],
  );

  const sortedGoals = useMemo(() => {
    const g = variant.goals;
    if (!g?.length) return [];
    return [...g].sort((a, b) => a.sort_key - b.sort_key);
  }, [variant.goals]);

  useEffect(() => {
    setHintCount(0);
    setActiveComment(pgnComments[0]?.comment ?? null);
  }, [variant.id, pgnComments]);

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
    setActiveComment(
      pgnComments.find((comment) => comment.fen === fen)?.comment ?? null,
    );
  };

  const handleFenAfterOpponentMove = (fen: string) => {
    setActiveComment(
      pgnComments.find((comment) => comment.fen === fen)?.comment ?? null,
    );
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
            onFenAfterUserMove={handleFenAfterUserMove}
            onFenAfterOpponentMove={handleFenAfterOpponentMove}
            onSolved={handleSolved}
            onHintUsed={setHintCount}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {sortedGoals.length > 0 ? (
            <Card>
              {sortedGoals.slice(0, 1).map((goal, index) => (
                <Fragment key={goal.sort_key}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                        <Target className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg">
                          Goal {index + 1}
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
                </Fragment>
              ))}
            </Card>
          ) : null}

          {activeComment?.trim() ? (
            <Card>
              <CardHeader className="min-w-0">
                <CardTitle className="text-base">Note</CardTitle>
                <p className="text-muted-foreground pt-1 text-sm leading-relaxed">
                  {highlightPgnCommentSpans(activeComment.trim())}
                </p>
              </CardHeader>
            </Card>
          ) : null}

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
