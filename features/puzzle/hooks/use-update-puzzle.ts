"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updatePuzzleAnswer,
  type UpdatePuzzleAnswerResponse,
} from "@/api-client/puzzle";

export function useUpdatePuzzleAnswer() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePuzzleAnswerHook = async (
    puzzleId: string,
    isCorrect: boolean,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updatePuzzleAnswer(puzzleId, { isCorrect });
      const result = response.data;

      if (isCorrect && result?.nextPuzzleId) {
        router.push(`/puzzle/${result.nextPuzzleId}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update puzzle result";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePuzzleAnswerHook, isLoading, error };
}
