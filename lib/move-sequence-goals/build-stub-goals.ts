import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import {
  getExpectedPlayerGoals,
  parseMovesFromSequence,
} from "@/lib/move-sequence-goals/expected-goals";

export function buildStubGoalsFromMoves(initialFen: string, moves: string): MoveGoals {
  const uciMoves = parseMovesFromSequence(moves);
  return {
    strategy: "",
    lessonsLearned: "",
    plys: getExpectedPlayerGoals(initialFen, uciMoves).map(({ ply, move }) => ({
      ply,
      move,
      title: "",
      visuals: [],
      strategy: "",
      checkpointMessage: "",
      isCompleted: false,
    })),
  };
}
