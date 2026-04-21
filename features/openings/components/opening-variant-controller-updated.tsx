"use client";

import { useEffect, useState } from "react";

import VoltBoardUpdated, { type VoltBoardFeedback } from "@/components/volt-board-updated/volt-board-updated";
import { useOpeningVariantControllerUpdated } from "@/features/openings/hooks/use-opening-variant-controller-updated";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";
import { getMoveQuality } from "@/lib/utils/getMoveQuality";

import type { OpeningVariant } from "../types/opening-variant";
import { OpeningHelperCard } from "./opening-helper-card";

type OpeningVariantControllerUpdatedProps = {
  variant: OpeningVariant;
  nextVariantId: string | null;
  parentOpeningUrl: string;
};

export default function OpeningVariantControllerUpdated({
  variant,
  nextVariantId,
  parentOpeningUrl,
}: OpeningVariantControllerUpdatedProps) {
  void nextVariantId;
  void parentOpeningUrl;

  const { _handleMoveCheck, _handleMovePlayed, nextGoal, lastMoveEvaluation } = useOpeningVariantControllerUpdated({
    variant,
  });
  const [feedback, setFeedback] = useState<VoltBoardFeedback | null>(null);
  const dummyVariantProgress = 68;
  const dummyVariantStatus = "In Progress";

  // ============================================================================
  // Oyuncu hamle denemesi yapınca önce onay verir/reddeder.
  // ============================================================================
  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = _handleMoveCheck(move);
    return isCorrect;
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra commit event'i gelir.
  // ============================================================================
  function handleBoardMovePlayed(move: MoveEvaluationPayload) {
    const { nextMove } = _handleMovePlayed(move);
    return nextMove;
  }

  // ============================================================================
  // Last move evaluation'ı her değiştiğinde tetiklenir.
  // Oyuncu hamlesinden sonra değişmeye başlar Hook da değişir.
  // ============================================================================
  useEffect(() => {
    if (!lastMoveEvaluation) return;
    const toSquare = lastMoveEvaluation.playedMove.slice(2, 4);
    const moveQuality = getMoveQuality(lastMoveEvaluation.deltaCp);

    setFeedback({
      to: toSquare,
      moveQuality,
    });
  }, [lastMoveEvaluation]);

  return (
    <div className="container mx-auto max-w-6xl px-8 py-6">
      <div className="grid gap-4 lg:grid-cols-[620px_minmax(0,1fr)] lg:gap-4">
        <div key={variant.id} className="relative w-full min-w-0">
          <VoltBoardUpdated
            sourceId={variant.id}
            onCheckMove={handleBoardCheckMove}
            onMovePlayed={handleBoardMovePlayed}
            feedback={feedback}
          />
        </div>
        <div className="flex h-full min-w-0 flex-col gap-4">
          <OpeningHelperCard title={variant.title} nextGoal={nextGoal} />
        </div>
      </div>
    </div>
  );
}
