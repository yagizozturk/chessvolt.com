"use client";

import { useState } from "react";

export function useOpeningVariantControllerUpdated(initialMoves: string[]) {
  const moves = initialMoves;
  const [moveCount, setMoveCount] = useState<number>(0);

  // ============================================================================
  // Oyuncu hamle yapınca tetiklenir.
  // ============================================================================
  function handleMovePlayed(playedMove: string) {
    const expectedMove = moves[moveCount];
    const isCorrect = playedMove === expectedMove;

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
    handleMovePlayed,
    incrementMoveCount,
    resetMoveCount,
  };
}
