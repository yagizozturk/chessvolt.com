import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { isMoveGoalsArray } from "@/features/move-sequence/validation/move-sequence-goals";

export function parseMovesFromSequence(moves: string): string[] {
  return moves
    .trim()
    .split(/\s+/)
    .filter((move) => move.length > 0);
}

export function normalizeGoalsFromMoves(uciMoves: string[], goals: MoveGoal[]): MoveGoal[] {
  return uciMoves.map((uci, index) => {
    const source = goals[index]!;
    return {
      ply: index + 1,
      move: uci,
      title: source.title,
      description: source.description,
      isCompleted: false,
      ...(source.card !== undefined ? { card: source.card } : {}),
      ...(source.imageSrc !== undefined ? { imageSrc: source.imageSrc } : {}),
      ...(source.imageAlt !== undefined ? { imageAlt: source.imageAlt } : {}),
    };
  });
}

export function validateGoalsForMoves(
  uciMoves: string[],
  goals: MoveGoal[],
): { ok: true } | { ok: false; message: string } {
  if (goals.length !== uciMoves.length) {
    return {
      ok: false,
      message: `Expected ${uciMoves.length} goals, got ${goals.length}`,
    };
  }

  for (let index = 0; index < goals.length; index++) {
    const goal = goals[index];
    if (!goal?.title?.trim()) {
      return { ok: false, message: `Goal at index ${index} is missing a title` };
    }
    if (!goal.description?.trim()) {
      return { ok: false, message: `Goal at index ${index} is missing a description` };
    }
    if (goal.ply !== index + 1) {
      return {
        ok: false,
        message: `Goal at index ${index} has ply ${goal.ply}, expected ${index + 1}`,
      };
    }
    if (goal.move !== uciMoves[index]) {
      return {
        ok: false,
        message: `Goal at index ${index} has move ${goal.move}, expected ${uciMoves[index]}`,
      };
    }
    if (goal.isCompleted !== false) {
      return { ok: false, message: `Goal at index ${index} must have isCompleted: false` };
    }
  }

  return { ok: true };
}

export function validateNormalizedGoals(
  uciMoves: string[],
  goals: unknown,
): { ok: true; goals: MoveGoal[] } | { ok: false; message: string } {
  if (!isMoveGoalsArray(goals)) {
    return { ok: false, message: "Goals must match the MoveGoal schema" };
  }

  const validation = validateGoalsForMoves(uciMoves, goals);
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, goals };
}
