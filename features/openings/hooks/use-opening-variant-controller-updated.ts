"use client";

import { useMoveEvaluation } from "@/features/openings/hooks/use-move-evaluation";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";
import { useState } from "react";

export function useOpeningVariantControllerUpdated(initialMoves: string[]) {
  const moves = initialMoves;
  const [moveCount, setMoveCount] = useState<number>(0);
  const { evaluateMove, engineStatus, lastMoveEvaluation } =
    useMoveEvaluation();

  // ============================================================================
  // Oyuncu hamle yapınca önce kontole girer(attempt) ve tetiklenir.
  // ============================================================================
  function _handleMoveCheck(playedMove: MoveAttemptPayload) {
    const expectedMove = moves[moveCount];
    const isCorrect = playedMove.uci === expectedMove;

    return {
      isCorrect,
    };
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra tetiklenir.
  // Oynandığına göre hamle doğrudur.
  // Sonraki rakip hamlesi varsa index 2 artar; yoksa 1 artar.
  // ============================================================================
  function _handleMovePlayed(playedMove: MoveEvaluationPayload) {
    evaluateMove(playedMove);
    const currentStep = moveCount;
    const nextMove = moves[currentStep + 1];
    const nextUserStep = nextMove ? currentStep + 2 : currentStep + 1;
    setMoveCount(nextUserStep);

    return {
      nextMove,
    };
  }

  // ============================================================================
  // Moves arrayi içindeki hamleyi bulmak için count ı arttrırır.
  // ============================================================================
  function _incrementMoveCount() {
    setMoveCount((prev) => prev + 1);
  }

  // ============================================================================
  // Move count'u sıfırlar.
  // ============================================================================
  function _resetMoveCount() {
    setMoveCount(0);
  }

  return {
    moves,
    engineStatus,
    lastMoveEvaluation,
    _handleMoveCheck,
    _handleMovePlayed,
    _incrementMoveCount,
    _resetMoveCount,
  };
}
