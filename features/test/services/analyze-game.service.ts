import type { CriticalMoment } from "@/features/test/types/critical-moment";
import type { GameAnalysisResponseData } from "@/features/test/types/game-analysis-response-data";
import { turnPgnIntoMoves } from "@/features/test/utilities/turn-pgn-into-moves";
import { analyzeFens } from "@/lib/chess-api/client";
import { toSideToMoveCp } from "@/lib/chess-api/normalize";
import { getMoveQuality } from "@/lib/utils/getMoveQuality";

const DEPTH = 12;

export async function analyzeGame(pgn: string): Promise<GameAnalysisResponseData> {
  const moves = turnPgnIntoMoves(pgn);
  if (!moves?.length) {
    throw new Error("Invalid or empty PGN");
  }

  const fens = [moves[0].fenBefore, ...moves.map((position) => position.fenAfter)];
  const analyses = await analyzeFens(fens, { depth: DEPTH, concurrency: 2 });
  const criticalMoments: CriticalMoment[] = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const before = analyses[i];
    const after = analyses[i + 1];
    const beforeCp = toSideToMoveCp(before.whiteCp, move.turn);
    const afterCp = toSideToMoveCp(after.whiteCp, move.turn);
    const deltaCp = afterCp - beforeCp;
    const quality = getMoveQuality(deltaCp);

    if (quality !== "mistake" && quality !== "blunder") continue;
    if (before.bestUci && before.bestUci === move.playedUci) continue;

    criticalMoments.push({
      ply: move.ply,
      fen: move.fenBefore,
      playedUci: move.playedUci,
      playedSan: move.playedSan,
      bestUci: before.bestUci ?? "",
      bestSan: before.bestSan ?? before.bestUci ?? "",
      beforeCp,
      afterCp,
      deltaCp,
      quality,
      mate: before.mate,
      turn: move.turn,
    });
  }

  return { moveCount: moves.length, depth: DEPTH, criticalMoments };
}
