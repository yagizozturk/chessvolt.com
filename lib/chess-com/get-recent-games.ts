import type { ChessGamesArchivesResponse } from "@/features/game-analysis/types/chess-games-archives-response";
import type { ChessGamesByMonthResponse } from "@/features/game-analysis/types/chess-games-by-month-response";
import type { PlatformGame } from "@/features/game-analysis/types/platform-game";
import { chessComFetch } from "@/lib/chess-com/client";
import { CHESS_COM_BASE_URL } from "@/lib/chess-com/constants";

// ================================================================================================
// Chess.com has no page cursor. Archives are monthly, newest month last.
// Skip `offset` newest games, then return the next `limit`. `hasMore` is true when one more game exists.
// ================================================================================================
export async function getRecentGames(
  username: string,
  limit = 10,
  offset = 0,
): Promise<{ games: PlatformGame[]; hasMore: boolean }> {
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 50);
  const safeOffset = Math.max(0, Math.floor(offset));
  const archives = await getPlayerMonthlyArchives(username);
  if (archives.length === 0) {
    return { games: [], hasMore: false };
  }

  const games: PlatformGame[] = [];
  let skipped = 0;

  for (let i = archives.length - 1; i >= 0; i--) {
    const monthGames = await getGamesByMonth(archives[i]!);
    const newestFirst = [...monthGames].sort((a, b) => b.end_time - a.end_time);

    for (const game of newestFirst) {
      if (skipped < safeOffset) {
        skipped += 1;
        continue;
      }

      if (games.length === safeLimit) {
        return { games, hasMore: true };
      }

      games.push({ ...game, source: "chesscom" });
    }
  }

  return { games, hasMore: false };
}

// ================================================================================================
// Chess.com fetch metodunu çağırır ve arşivi çeker.
// Dönen cevabı JSON a çevirir ChessGamesArchivesResponse tipinde.
// ================================================================================================
export async function getPlayerMonthlyArchives(username: string): Promise<string[]> {
  const normalizedUsername = username.trim().toLowerCase();
  const url = `${CHESS_COM_BASE_URL}/player/${encodeURIComponent(normalizedUsername)}/games/archives`;

  const response = await chessComFetch(url);
  const data = (await response.json()) as ChessGamesArchivesResponse; // .json() metodu gelen bu ham veriyi okur ve JSON formatındaki metni çözerek (parse ederek) kullanılabilir bir JavaScript nesnesine (Object/Array) çevirir.

  return data.archives ?? [];
}

// ================================================================================================
// Chess.com fetch metodunu aylara göre ağırır.
// Dönen cevabı JSON a çevirir ChessGamesByMonthResponse tipinde.
// ================================================================================================
export async function getGamesByMonth(archiveUrl: string): Promise<PlatformGame[]> {
  const response = await chessComFetch(archiveUrl.trim());
  const data = (await response.json()) as ChessGamesByMonthResponse;

  return data.games ?? [];
}
