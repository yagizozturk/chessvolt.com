import type { ChessComPlayerStats } from "@/features/game-analysis/types/chesscom-player-stats";
import { chessComFetch } from "@/lib/chess-com/client";
import { CHESS_COM_BASE_URL } from "@/lib/chess-com/constants";

export async function getChessComPlayerStats(username: string): Promise<ChessComPlayerStats> {
  const normalizedUsername = username.trim().toLowerCase();
  const url = `${CHESS_COM_BASE_URL}/player/${encodeURIComponent(normalizedUsername)}/stats`;
  const response = await chessComFetch(url);
  return (await response.json()) as ChessComPlayerStats;
}
