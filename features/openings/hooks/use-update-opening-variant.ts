"use client";

import { useState } from "react";
import { updateOpeningVariantAnswer } from "@/features/openings/api/openings";

export function useUpdateOpeningVariantAnswer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOpeningVariantAnswerHook = async (
    openingVariantId: string,
    isCorrect: boolean,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateOpeningVariantAnswer(openingVariantId, { isCorrect });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update opening variant result";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateOpeningVariantAnswerHook, isLoading, error };
}
