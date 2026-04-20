"use client";

import { useChessEngine } from "@/lib/engine/hooks/use-stockfish-engine";
import type { EngineInfo } from "@/lib/shared/types/engine-info";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";
import { useEffect, useRef, useState } from "react";

type PendingEvaluation = MoveEvaluationPayload & {
  beforeCp: number | null;
};

export type MoveEvaluation = {
  playedMove: string;
  beforeCp: number | null;
  afterCp: number | null;
  deltaCp: number | null;
};

function getScoreCp(infos: EngineInfo[]) {
  const multipv1 = infos
    .filter((info) => info.multipv === 1 && info.scoreCp !== undefined)
    .at(-1);
  if (multipv1?.scoreCp !== undefined) return multipv1.scoreCp;

  const fallback = infos.filter((info) => info.scoreCp !== undefined).at(-1);
  return fallback?.scoreCp ?? null;
}

export function useMoveEvaluation() {
  const [lastMoveEvaluation, setLastMoveEvaluation] =
    useState<MoveEvaluation | null>(null);
  const stageRef = useRef<"idle" | "before" | "after">("idle");
  const activeEvalRef = useRef<PendingEvaluation | null>(null);
  const queuedEvalRef = useRef<PendingEvaluation | null>(null);
  const engineStatusRef = useRef<"loading" | "thinking" | "idle">("loading");

  const { analyze, status: engineStatus } = useChessEngine({
    difficulty: "Expert",
    onBestMove: (_bestMove, infos) => {
      const active = activeEvalRef.current;
      if (!active) return;

      if (stageRef.current === "before") {
        active.beforeCp = getScoreCp(infos);
        stageRef.current = "after";
        analyze(active.fenAfter, 10);
        return;
      }

      if (stageRef.current !== "after") return;

      const afterScoreForOpponent = getScoreCp(infos);
      const beforeCp = active.beforeCp;
      const afterCp =
        afterScoreForOpponent == null ? null : -afterScoreForOpponent;
      const deltaCp =
        beforeCp == null || afterCp == null ? null : afterCp - beforeCp;

      setLastMoveEvaluation({
        playedMove: active.uci,
        beforeCp,
        afterCp,
        deltaCp,
      });

      activeEvalRef.current = null;
      stageRef.current = "idle";
    },
  });

  useEffect(() => {
    engineStatusRef.current = engineStatus;
  }, [engineStatus]);

  useEffect(() => {
    if (engineStatus !== "idle") return;
    if (stageRef.current !== "idle") return;
    if (!queuedEvalRef.current) return;

    activeEvalRef.current = queuedEvalRef.current;
    queuedEvalRef.current = null;
    stageRef.current = "before";
    analyze(activeEvalRef.current.fenBefore, 10);
  }, [analyze, engineStatus]);

  function evaluateMove(move: MoveEvaluationPayload) {
    const nextEval: PendingEvaluation = {
      ...move,
      beforeCp: null,
    };

    if (stageRef.current === "idle" && engineStatusRef.current === "idle") {
      activeEvalRef.current = nextEval;
      stageRef.current = "before";
      analyze(nextEval.fenBefore, 10);
      return;
    }

    queuedEvalRef.current = nextEval;
  }

  return {
    evaluateMove,
    engineStatus,
    lastMoveEvaluation,
  };
}
