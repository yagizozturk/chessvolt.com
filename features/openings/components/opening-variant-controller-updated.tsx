"use client";

import VoltBoardUpdated, {
  type VoltBoardFeedback,
} from "@/components/volt-board-updated/volt-board-updated";
import { useOpeningVariantControllerUpdated } from "@/features/openings/hooks/use-opening-variant-controller-updated";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";
import { getMoveQuality } from "@/lib/utils/getMoveQuality";
import { useEffect, useState } from "react";

type OpeningVariantControllerUpdatedProps = {
  moves: string[];
};

export default function OpeningVariantControllerUpdated({
  moves,
}: OpeningVariantControllerUpdatedProps) {
  const {
    handleMoveAttempt,
    handleMoveCommitted,
    moveCount,
    lastMoveEvaluation,
  } =
    useOpeningVariantControllerUpdated(moves);
  const [feedback, setFeedback] = useState<VoltBoardFeedback | null>(null);

  // ============================================================================
  // Oyuncu hamle denemesi yapınca önce onay verir/reddeder.
  // ============================================================================
  function handleBoardMoveAttempt(move: MoveAttemptPayload) {
    const { isCorrect } = handleMoveAttempt(move);
    return isCorrect;
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra commit event'i gelir.
  // ============================================================================
  function handleBoardMovePlayed(move: MoveEvaluationPayload) {
    handleMoveCommitted(move);
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
    <VoltBoardUpdated
      onMoveAttempt={handleBoardMoveAttempt}
      onMovePlayed={handleBoardMovePlayed}
      feedback={feedback}
    />
  );
}
