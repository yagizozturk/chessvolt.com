import type { ChessGamesArchivesResponse } from "@/features/game-analysis/types/chess-games-archives-response";
import type { ChessGamesByMonthResponse } from "@/features/game-analysis/types/chess-games-by-month-response";
import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";
import { chessComFetch } from "@/lib/chess-com/client";
import { CHESS_COM_BASE_URL } from "@/lib/chess-com/constants";

// ================================================================================================
// En yenisi başta gelecek şekeilde Chess.com oyun arşivini aylara göre çeker.
// Limiti bulana kadar(biz belirleriz), en son aydan en eski aya kadar o sayıda oyunu bulur.
// ================================================================================================
export async function getRecentGames(username: string, limit = 10): Promise<{ games: ChessComGame[] }> {
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 50); // Math.floor ile 1 den düşük olmamasını sağlarız. Math.max ile 50 den büyükse 50'ye eşitleriz.
  const archives = await getPlayerMonthlyArchives(username);
  if (archives.length === 0) {
    return { games: [] };
  }

  const chessComGames: ChessComGame[] = [];

  // En yenisi başta gelecek şekeilde Chess.com oyun arşivini aylara göre çeker.
  for (let i = archives.length - 1; i >= 0 && chessComGames.length < safeLimit; i--) {
    const monthGames = await getGamesByMonth(archives[i]!);
    const newestFirst = [...monthGames].sort((a, b) => b.end_time - a.end_time);

    for (const game of newestFirst) {
      chessComGames.push(game);
      if (chessComGames.length >= safeLimit) break;
    }
  }

  return { games: chessComGames };
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
export async function getGamesByMonth(archiveUrl: string): Promise<ChessComGame[]> {
  const response = await chessComFetch(archiveUrl.trim());
  const data = (await response.json()) as ChessGamesByMonthResponse;

  return data.games ?? [];
}
