"use client";

import { useCallback, useState } from "react";

import type { ApiError } from "@/api-client/client";
import { requestGameReview } from "@/features/game-review/api/game-review";
import type { CriticalMoment, GameReviewResult } from "@/features/game-review/types/game-review";

type ReviewStatus = "idle" | "loading" | "success" | "error";

export function useGameReview() {
  const [status, setStatus] = useState<ReviewStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GameReviewResult | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<CriticalMoment | null>(null);

  const review = useCallback(async (pgn: string, options?: { depth?: number; includeInaccuracies?: boolean }) => {
    const trimmed = pgn.trim();
    if (!trimmed) {
      setError("Paste a PGN first");
      setStatus("error");
      return null;
    }

    setStatus("loading");
    setError(null);
    setSelectedMoment(null);

    try {
      const response = await requestGameReview({
        pgn: trimmed,
        depth: options?.depth,
        includeInaccuracies: options?.includeInaccuracies,
      });

      if (!response.success || !response.data) {
        throw { error: response.error || "Review failed", status: 500 } satisfies ApiError;
      }

      setResult(response.data);
      setStatus("success");
      return response.data;
    } catch (err) {
      const message =
        err && typeof err === "object" && "error" in err
          ? String((err as ApiError).error)
          : err instanceof Error
            ? err.message
            : "Review failed";
      setError(message);
      setResult(null);
      setStatus("error");
      return null;
    }
  }, []);

  const selectMoment = useCallback((moment: CriticalMoment | null) => {
    setSelectedMoment(moment);
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResult(null);
    setSelectedMoment(null);
  }, []);

  return {
    status,
    error,
    result,
    criticalMoments: result?.criticalMoments ?? [],
    selectedMoment,
    review,
    selectMoment,
    reset,
  };
}
