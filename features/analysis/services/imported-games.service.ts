import { ChessComApiError } from "@/lib/chess-com/errors";
import { getRecentGames } from "@/lib/chess-com/get-recent-games";
import { LichessApiError } from "@/lib/lichess/errors";
import { getLichessRecentGames } from "@/lib/lichess/get-recent-games";

import {
  toImportedGameFromChessCom,
  toImportedGameFromLichess,
} from "@/features/analysis/mappers/to-imported-game";
import {
  IMPORTED_GAMES_LIMIT,
  type ImportedGame,
  type ImportedGamePlatform,
} from "@/features/analysis/types/imported-game";

export async function getImportedGames(
  platform: ImportedGamePlatform,
  username: string,
  limit = IMPORTED_GAMES_LIMIT,
): Promise<ImportedGame[]> {
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername) {
    return [];
  }

  if (platform === "chesscom") {
    const { games } = await getRecentGames(normalizedUsername, limit);
    return games.map(toImportedGameFromChessCom).filter((game): game is ImportedGame => game != null);
  }

  const games = await getLichessRecentGames(normalizedUsername, limit);
  return games.map(toImportedGameFromLichess).filter((game): game is ImportedGame => game != null);
}

export function importedGamesUpstreamStatus(error: unknown): number | null {
  if (error instanceof ChessComApiError || error instanceof LichessApiError) {
    return error.status ?? 502;
  }
  return null;
}
