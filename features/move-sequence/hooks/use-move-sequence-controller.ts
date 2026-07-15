// TODO: Refactor
"use client";

import { useEffect, useMemo, useState } from "react";

import type { MoveGoal, MoveGoals } from "@/features/move-sequence/types/move-goal";
import { normalizeMoveGoal } from "@/features/move-sequence/validation/move-sequence-goals";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

export const MAX_HINT_COUNT = 2;

export type UseMoveSequenceControllerParams = {
  /** Resets play state when this id changes (variant id, riddle id, etc.) */
  sourceId: string;
  moves: string;
  goals: MoveGoals | null;
  /** When set, goals at or before this ply start as completed (opening variants). */
  initialPly?: number;
};

function parseMoves(rawMoves: string): string[] {
  return rawMoves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
}

function initializeGoals(goals: MoveGoals | null, initialPly?: number): MoveGoal[] {
  return [...(goals?.plys ?? [])]
    .map((goal) => normalizeMoveGoal(goal) ?? goal)
    .sort((a, b) => a.ply - b.ply)
    .map((goal) => ({
      ...goal,
      isCompleted:
        goal.isCompleted || (initialPly !== undefined && initialPly >= goal.ply),
    }));
}

export function useMoveSequenceController({
  sourceId,
  moves: rawMoves,
  goals,
  initialPly,
}: UseMoveSequenceControllerParams) {
  const moves = useMemo(() => parseMoves(rawMoves), [rawMoves]);
  const [nextExpectedMoveIndex, setNextExpectedMoveIndex] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [goalsState, setGoalsState] = useState<MoveGoal[]>([]);

  const sortedGoals = useMemo(() => {
    return [...goalsState].sort((a, b) => a.ply - b.ply);
  }, [goalsState]);

  const nextGoal = useMemo(() => {
    return sortedGoals.find((goal) => !goal.isCompleted) ?? null;
  }, [sortedGoals]);

  const progressValue = useMemo(() => {
    if (!sortedGoals.length) return 0;
    const completedGoalsCount = sortedGoals.filter((goal) => goal.isCompleted).length;
    return Math.round((completedGoalsCount / sortedGoals.length) * 100);
  }, [sortedGoals]);

  const isAllGoalsCompleted =
    sortedGoals.length > 0 && sortedGoals.every((goal) => goal.isCompleted);

  useEffect(() => {
    setHintCount(0);
    setNextExpectedMoveIndex(0);
    setGoalsState(initializeGoals(goals, initialPly));
  }, [sourceId, initialPly, goals]);

  function handleMoveCheck(playedMove: MoveAttemptPayload) {
    const expectedMove = moves[nextExpectedMoveIndex];
    const isCorrect = playedMove.uci === expectedMove;
    return { isCorrect };
  }

  function handleSuccessMovePlayed(move: Move) {
    const { uci } = move;
    if (!uci) return;

    setGoalsState((prev) =>
      prev.map((goal) => (goal.move === uci ? { ...goal, isCompleted: true } : goal)),
    );
  }

  function handleNextMoveRequest() {
    const currentStep = nextExpectedMoveIndex;
    const nextMove = moves[currentStep + 1];
    const nextUserStep = nextMove ? currentStep + 2 : currentStep + 1;
    setNextExpectedMoveIndex(nextUserStep);
    setHintCount(0);
    return nextMove;
  }

  function incrementNextExpectedMoveIndex() {
    setNextExpectedMoveIndex((prev) => prev + 1);
  }

  function resetNextExpectedMoveIndex() {
    setNextExpectedMoveIndex(0);
  }

  const hintRequested = () => {
    if (hintCount >= MAX_HINT_COUNT) return null;
    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    return nextHintCount;
  };

  const expectedCurrentCorrectMoveUci = moves[nextExpectedMoveIndex] ?? null;

  return {
    moves,
    sortedGoals,
    nextGoal,
    strategy: goals?.strategy ?? "",
    lessonsLearned: goals?.lessonsLearned ?? "",
    isAllGoalsCompleted,
    hintCount,
    progressValue,
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    incrementNextExpectedMoveIndex,
    resetNextExpectedMoveIndex,
    hintRequested,
    expectedCurrentCorrectMoveUci,
  };
}
