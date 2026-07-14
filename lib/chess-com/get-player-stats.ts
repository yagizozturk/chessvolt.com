import { CHESS_COM_BASE_URL, chessComFetch } from "@/lib/chess-com/client";
import type { ChessComPlayerStats } from "@/lib/chess-com/types";

export async function getChessComPlayerStats(username: string): Promise<ChessComPlayerStats> {
  const normalizedUsername = username.trim().toLowerCase();
  const url = `${CHESS_COM_BASE_URL}/player/${encodeURIComponent(normalizedUsername)}/stats`;
  const response = await chessComFetch(url);
  return (await response.json()) as ChessComPlayerStats;
}
