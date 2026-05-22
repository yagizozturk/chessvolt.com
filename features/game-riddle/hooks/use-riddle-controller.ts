"use client";

import { useEffect, useMemo, useState } from "react";

import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

type UseRiddleControllerParams = {
  riddle: GameRiddle;
};

export function useRiddleController({ riddle }: UseRiddleControllerParams) {
  const moves = riddle.moveSequence.moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  const [nextExpectedMoveIndex, setNextExpectedMoveIndex] = useState<number>(0);
  const [hintCount, setHintCount] = useState(0);
  const [goalsState, setGoalsState] = useState<MoveGoal[]>([]);

  const sortedGoals = useMemo(() => {
    return [...goalsState].sort((a, b) => a.ply - b.ply);
  }, [goalsState]);

  const progressValue = useMemo(() => {
    if (!sortedGoals.length) return 0;
    const completedGoalsCount = sortedGoals.filter((goal) => goal.isCompleted).length;
    return Math.round((completedGoalsCount / sortedGoals.length) * 100);
  }, [sortedGoals]);

  useEffect(() => {
    setHintCount(0);
    setNextExpectedMoveIndex(0);
    setGoalsState(
      [...(riddle.moveSequence.goals ?? [])]
        .sort((a, b) => a.ply - b.ply)
        .map((goal) => ({ ...goal })),
    );
  }, [riddle.id, riddle.moveSequence.goals]);

  function handleMoveCheck(playedMove: MoveAttemptPayload) {
    const expectedMove = moves[nextExpectedMoveIndex];
    const isCorrect = playedMove.uci === expectedMove;

    return {
      isCorrect,
    };
  }

  function handleSuccessMovePlayed(move: Move) {
    const { uci } = move;
    if (!uci) return;

    setGoalsState((prev) => prev.map((goal) => (goal.move === uci ? { ...goal, isCompleted: true } : goal)));
  }

  function handleNextMoveRequest() {
    const currentStep = nextExpectedMoveIndex;
    const nextMove = moves[currentStep + 1];
    const nextUserStep = nextMove ? currentStep + 2 : currentStep + 1;

    setNextExpectedMoveIndex(nextUserStep);
    setHintCount(0);
    return nextMove;
  }

  const hintRequested = () => {
    if (hintCount >= 2) return null;
    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    return nextHintCount;
  };

  const currentCorrectMove = moves[nextExpectedMoveIndex] ?? null;

  return {
    sortedGoals,
    hintCount,
    progressValue,
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    hintRequested,
    currentCorrectMove,
  };
}
