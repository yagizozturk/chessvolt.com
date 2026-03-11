"use client";

import { useState } from "react";
import { getPuzzleCoach } from "@/features/puzzle/api/puzzle";

export function useGetPuzzleCoach() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coachResponse, setCoachResponse] = useState<string | null>(null);

  const getPuzzleCoachHook = async (fen: string, nextMove: string) => {
    setLoading(true);
    setError(null);
    setCoachResponse(null);

    try {
      const response = await getPuzzleCoach(fen, nextMove);
      setCoachResponse(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    getPuzzleCoachHook,
    coachResponse,
    isLoading,
    error,
  };
}
