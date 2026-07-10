import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import {
  getExpectedPlayerGoals,
  parseMovesFromSequence,
} from "@/lib/move-sequence-goals/expected-goals";

export function buildStubGoalsFromMoves(initialFen: string, moves: string): MoveGoal[] {
  const uciMoves = parseMovesFromSequence(moves);
  return getExpectedPlayerGoals(initialFen, uciMoves).map(({ ply, move }) => ({
    ply,
    move,
    isCompleted: false,
  })) as MoveGoal[];
}
