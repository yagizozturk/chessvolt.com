import type { ImportedGame } from "@/features/game-analysis/types/imported-game";
import type { ChesscomRealGame } from "@/features/game-analysis/types/chesscom-real-game";

export function normalizeChesscomGame(game: ChesscomRealGame): ImportedGame {
  return {
    id: game.uuid,
    platform: "chesscom",
    url: game.url,
    endTime: game.end_time,
    timeClass: game.time_class,
    rated: game.rated ?? false,
    white: {
      username: game.white.username,
      rating: game.white.rating ?? null,
      result: game.white.result?.replaceAll("_", " ") ?? "",
    },
    black: {
      username: game.black.username,
      rating: game.black.rating ?? null,
      result: game.black.result?.replaceAll("_", " ") ?? "",
    },
    pgn: game.pgn,
  };
}
