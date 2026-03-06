"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createEngine } from "@/lib/stockfish/createEngine";
import { SkillLevel } from "@/types/game";
import { EngineInfo } from "@/lib/model/engine-info";
import { parseEngine } from "@/lib/stockfish/parseEngine";

type EngineStatus = "loading" | "idle" | "thinking";

type UseChessEngineOptions = {
  difficulty: SkillLevel;
  onReady?: () => void;
  onBestMove: (bestMove: string, infos: EngineInfo[]) => void;
};

export function useChessEngine({
  difficulty,
  onReady,
  onBestMove,
}: UseChessEngineOptions) {
  const engineRef = useRef<Worker | null>(null);
  const waitingRef = useRef(false);
  const [status, setStatus] = useState<EngineStatus>("loading");
  const multipvBuffer = useRef<EngineInfo[]>([]);

  // ============================================================================
  // Engine Initialize
  // ============================================================================
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.terminate();
      engineRef.current = null;
    }

    waitingRef.current = false;
    setStatus("loading");

    engineRef.current = createEngine({
      skillLevel: difficulty,
      onReady: () => {
        // createEngine already sends "ucinewgame" automatically.
        engineRef.current?.postMessage("setoption name MultiPV value 3");
        setStatus("idle");
        onReady?.();
      },
      onMessage: (line: string) => {
        const engineInfo = parseEngine(line);
        if (!engineInfo) return;

        // Best Move comes last, so we check multipv entries before it.
        if (!engineInfo.bestmove) {
          if (engineInfo.multipv !== undefined) {
            multipvBuffer.current.push(engineInfo);
          }
          return;
        }

        waitingRef.current = false;
        setStatus("idle");

        const allInfos = [...multipvBuffer.current];
        multipvBuffer.current = [];

        onBestMove(engineInfo.bestmove, allInfos);
      },
    });

    return () => {
      engineRef.current?.terminate();
      engineRef.current = null;
      waitingRef.current = false;
    };
  }, [difficulty]);

  // ============================================================================
  // Analyze position at given depth
  // ============================================================================
  const analyze = useCallback((fen: string, depth = 8) => {
    if (!engineRef.current || waitingRef.current) return;

    multipvBuffer.current = [];

    engineRef.current.postMessage(`position fen ${fen}`);
    engineRef.current.postMessage(`go depth ${depth}`);

    waitingRef.current = true;
    setStatus("thinking");
  }, []);

  return {
    analyze,
    status, // "loading" | "thinking" | "idle"
  };
}
