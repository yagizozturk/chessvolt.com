"use server";

import type { ChesscomRealGame } from "@/features/test/types/chesscom-real-game";

const CHESS_COM_GAMES_URL = "https://api.chess.com/pub/player";
const CHESS_COM_USER_AGENT = "ChessVolt/1.0 (contact: admin@chessvolt.com)";
const GAME_LIST_LIMIT = 10;

async function chesscomFetch(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": CHESS_COM_USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Chess.com request failed: ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

export async function requestChesscomGames(username: string): Promise<ChesscomRealGame[]> {
  const normalized = username.trim().toLowerCase();
  const archives = (await chesscomFetch(`${CHESS_COM_GAMES_URL}/${encodeURIComponent(normalized)}/games/archives`)) as {
    archives?: string[];
  };

  const latestArchive = archives.archives?.at(-1);
  if (!latestArchive) return [];

  const month = (await chesscomFetch(latestArchive)) as { games?: ChesscomRealGame[] };
  const games = month.games ?? [];

  return [...games].sort((a, b) => b.end_time - a.end_time).slice(0, GAME_LIST_LIMIT);
}
