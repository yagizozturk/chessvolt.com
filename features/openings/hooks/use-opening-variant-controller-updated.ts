"use client";

import {
  useMoveEvaluation,
} from "@/features/openings/hooks/use-move-evaluation";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";
import { useState } from "react";

export function useOpeningVariantControllerUpdated(initialMoves: string[]) {
  const moves = initialMoves;
  const [moveCount, setMoveCount] = useState<number>(0);
  const { evaluateMove, engineStatus, lastMoveEvaluation } =
    useMoveEvaluation();

  // ============================================================================
  // Oyuncu hamle denemesi yapınca tetiklenir.
  // ============================================================================
  function handleMoveAttempt(playedMove: MoveAttemptPayload) {
    const expectedMove = moves[moveCount];
    const isCorrect = playedMove.uci === expectedMove;

    if (isCorrect) {
      incrementMoveCount();
    }

    return {
      isCorrect,
    };
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra tetiklenir.
  // ============================================================================
  function handleMoveCommitted(playedMove: MoveEvaluationPayload) {
    evaluateMove(playedMove);
  }

  // ============================================================================
  // Moves arrayi içindeki hamleyi bulmak için count ı arttrırır.
  // ============================================================================
  function incrementMoveCount() {
    setMoveCount((prev) => prev + 1);
  }

  // ============================================================================
  // Move count'u sıfırlar.
  // ============================================================================
  function resetMoveCount() {
    setMoveCount(0);
  }

  return {
    moves,
    moveCount,
    engineStatus,
    lastMoveEvaluation,
    handleMoveAttempt,
    handleMoveCommitted,
    incrementMoveCount,
    resetMoveCount,
  };
}
