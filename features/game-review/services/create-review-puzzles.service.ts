import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import type { CriticalMoment } from "@/features/game-review/types/game-review";
import { createPuzzle } from "@/features/puzzle/services/puzzle.service";
import { buildStubGoalsFromMoves } from "@/lib/move-sequence-goals/build-stub-goals";
import { createAdminClient } from "@/lib/supabase/admin";

function reviewPuzzleSource(source: GameAnalysisSource, username: string): string {
  const trimmed = username.trim();
  return source === "chesscom" ? `chess-com-${trimmed}-puzzle` : `lichess-${trimmed}-puzzle`;
}

export async function createReviewPuzzles(input: {
  userId: string;
  username: string;
  source: GameAnalysisSource;
  gameId: string;
  moments: CriticalMoment[];
}): Promise<void> {
  const username = input.username.trim();
  const gameId = input.gameId.trim();
  if (!username || !gameId || input.moments.length === 0) return;

  const admin = createAdminClient();
  const source = reviewPuzzleSource(input.source, username);

  for (const moment of input.moments) {
    const bestUci = moment.bestUci.trim();
    if (!bestUci) continue;

    const puzzle = await createPuzzle(admin, {
      sourceId: gameId,
      source,
      title: moment.bestSan ? `Find ${moment.bestSan}` : "Find the better move",
      moves: bestUci,
      initialFen: moment.fen,
      displayFen: moment.fen,
      goals: buildStubGoalsFromMoves(moment.fen, bestUci),
      isActive: true,
      createdBy: input.userId,
    });

    if (!puzzle) {
      console.error("create-review-puzzles: failed to create puzzle", {
        userId: input.userId,
        source,
        gameId,
        ply: moment.ply,
      });
    }
  }
}
