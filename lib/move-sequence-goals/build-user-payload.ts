import type { ExpectedPlayerGoal } from "@/lib/move-sequence-goals/expected-goals";
import type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";

export function buildUserPayload(
  input: GenerateGoalsInput,
  uciMoves: string[],
  expectedGoals: ExpectedPlayerGoal[],
) {
  return {
    initialFen: input.initialFen,
    pgn: input.pgn,
    moves: input.moves,
    uciMoves,
    playerGoalCount: expectedGoals.length,
    playerMoves: expectedGoals.map((goal) => ({
      ply: goal.ply,
      move: goal.move,
    })),
  };
}
