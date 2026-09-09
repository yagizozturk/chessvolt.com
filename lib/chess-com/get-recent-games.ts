import { CHESS_COM_BASE_URL, chessComFetch } from "@/lib/chess-com/client";
import type { ChessComGame } from "@/lib/chess-com/types";

type ChessArchivesResponse = {
  archives: string[];
};

type ChessGamesByMonthResponse = {
  games: ChessComGame[];
};

export async function getPlayerMonthlyArchives(username: string): Promise<string[]> {
  const normalizedUsername = username.trim().toLowerCase();
  const url = `${CHESS_COM_BASE_URL}/player/${encodeURIComponent(normalizedUsername)}/games/archives`;

  const response = await chessComFetch(url);
  const data = (await response.json()) as ChessArchivesResponse;

  return data.archives ?? [];
}

export async function getGamesByMonth(archiveUrl: string): Promise<ChessComGame[]> {
  const response = await chessComFetch(archiveUrl.trim());
  const data = (await response.json()) as ChessGamesByMonthResponse;

  return data.games ?? [];
}

/**
 * Fetches the player's most recent games across monthly archives (newest first).
 * Walks archives from newest → oldest until `limit` games are collected.
 */
export async function getRecentGames(username: string, limit = 10): Promise<{ games: ChessComGame[] }> {
  const capped = Math.min(Math.max(1, Math.floor(limit)), 50);
  const archives = await getPlayerMonthlyArchives(username);
  if (archives.length === 0) {
    return { games: [] };
  }

  const collected: ChessComGame[] = [];

  for (let i = archives.length - 1; i >= 0 && collected.length < capped; i--) {
    const monthGames = await getGamesByMonth(archives[i]!);
    const newestFirst = [...monthGames].sort((a, b) => b.end_time - a.end_time);

    for (const game of newestFirst) {
      collected.push(game);
      if (collected.length >= capped) break;
    }
  }

  return { games: collected };
}
