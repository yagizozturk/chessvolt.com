"use client";

import { useCallback, useRef, useState } from "react";

import {
  analyzeGamePgn,
  type AnalyzedMove,
} from "@/lib/engine/analyzeGamePgn";

export const ANALYSIS_DEPTH = 12;

export type AnalysisProgress = {
  done: number;
  total: number;
};

export function usePgnGameAnalysis() {
  const [moves, setMoves] = useState<AnalyzedMove[] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    cancel();
    setMoves(null);
    setProgress(null);
    setError(null);
    setAnalyzing(false);
  }, [cancel]);

  const analyze = useCallback(async (pgn: string) => {
    cancel();
    const controller = new AbortController();
    abortRef.current = controller;

    setAnalyzing(true);
    setError(null);
    setMoves(null);
    setProgress({ done: 0, total: 0 });

    try {
      const results = await analyzeGamePgn({
        pgn,
        depth: ANALYSIS_DEPTH,
        signal: controller.signal,
        onProgress: setProgress,
      });
      if (controller.signal.aborted) return;
      setMoves(results);
      setProgress({ done: results.length, total: results.length });
    } catch (e) {
      if (controller.signal.aborted) {
        setError(null);
        return;
      }
      setError(e instanceof Error ? e.message : "Analysis failed");
      setMoves(null);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setAnalyzing(false);
    }
  }, [cancel]);

  return {
    moves,
    analyzing,
    progress,
    error,
    analyze,
    cancel,
    reset,
  };
}
