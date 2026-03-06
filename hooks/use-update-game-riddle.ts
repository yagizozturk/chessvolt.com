"use client";

import { useState } from "react";
import { updateGameRiddleAnswer } from "@/lib/api/game-riddle";

export function useUpdateGameRiddleAnswer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGameRiddleAnswerHook = async (
    gameRiddleId: string,
    isCorrect: boolean
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateGameRiddleAnswer(gameRiddleId, { isCorrect });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update riddle result";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateGameRiddleAnswerHook, isLoading, error };
}
