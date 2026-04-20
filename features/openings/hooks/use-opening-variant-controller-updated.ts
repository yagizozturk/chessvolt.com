"use client";

import {
  type MoveEvaluationPayload,
  useMoveEvaluation,
} from "@/features/openings/hooks/use-move-evaluation";
import { useState } from "react";

export function useOpeningVariantControllerUpdated(initialMoves: string[]) {
  const moves = initialMoves;
  const [moveCount, setMoveCount] = useState<number>(0);
  const { evaluateMove, engineStatus, lastMoveEvaluation } =
    useMoveEvaluation();

  // ============================================================================
  // Oyuncu hamle yapınca tetiklenir.
  // ============================================================================
  function handleMovePlayed(playedMove: MoveEvaluationPayload) {
    const expectedMove = moves[moveCount];
    const isCorrect = playedMove.uci === expectedMove;
    evaluateMove(playedMove);

    if (isCorrect) {
      incrementMoveCount();
    }

    return {
      isCorrect,
    };
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
    handleMovePlayed,
    incrementMoveCount,
    resetMoveCount,
  };
}
