import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import { getCriticalMoments } from "@/features/game-analysis/utilities/get-critical-moments";
import { getMovesFromPgn } from "@/lib/chess/getMovesFromPgn";
import { getPlayerRatingsFromPgn } from "@/lib/chess/getPlayerRatingsFromPgn";
import { analyzeFens } from "@/lib/chess-api/client";

const DEPTH = 12;

export async function analyzeGame(pgn: string): Promise<GameAnalysisResponseData> {
  const moves = getMovesFromPgn(pgn);
  if (!moves?.length) {
    throw new Error("Invalid or empty PGN");
  }

  const fens = [moves[0].fenBefore, ...moves.map((position) => position.fenAfter)];
  const analyses = await analyzeFens(fens, { depth: DEPTH, concurrency: 2 });

  return {
    moveCount: moves.length,
    depth: DEPTH,
    criticalMoments: getCriticalMoments(moves, analyses, getPlayerRatingsFromPgn(pgn)),
  };
}
