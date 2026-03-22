"use client";

import { SuccessOverlay } from "@/components/success-overlay/success-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { getCommentsAndFensFromPgn } from "@/lib/chess/getCommentFromPgnAtPly";
import { highlightPgnCommentSpans } from "@/lib/chess/highlight-pgn-comment";
import type { PgnCommentRow } from "@/lib/shared/types/pgn-comment";
import { Lightbulb, Puzzle } from "lucide-react";
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
  openingName,
  nextVariantId,
  parentOpeningUrl = "/openings",
}: {
  variant: OpeningVariant;
  openingName?: string;
  nextVariantId?: string | null;
  parentOpeningUrl?: string;
}) {
  const router = useRouter();
  const turn =
    ((variant.initialFen ?? variant.displayFen)?.includes(" w ") ?? true)
      ? "White"
      : "Black";
  const moveCount = getMoveCount(variant.moves);
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

  const handlePlayerMovePlayed = (actualFen: string) => {
    setActiveComment(
      pgnComments.find((comment) => comment.fen === actualFen)?.comment ?? null,
    );
  };

  const handleOpponentMovePlayed = (actualFen: string) => {
    setActiveComment(
      pgnComments.find((comment) => comment.fen === actualFen)?.comment ?? null,
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
            onPlayerMovePlayed={handlePlayerMovePlayed}
            onOpponentMovePlayed={handleOpponentMovePlayed}
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

          <Card>
            <CardHeader className="min-w-0 overflow-hidden">
              <CardTitle className="text-2xl font-bold break-words">
                {variant.title || "Untitled Variant"}
              </CardTitle>
              {openingName && (
                <p className="text-muted-foreground pt-2 text-sm">
                  {openingName}
                </p>
              )}
            </CardHeader>
          </Card>

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
