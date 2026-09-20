import { LICHESS_BASE_URL, lichessFetch } from "@/lib/lichess/client";
import type { LichessGame } from "@/lib/lichess/types";

function parseNdjson(text: string): LichessGame[] {
  const games: LichessGame[] = [];

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    games.push(JSON.parse(trimmed) as LichessGame);
  }

  return games;
}

export async function getLichessRecentGames(username: string, limit = 10): Promise<LichessGame[]> {
  const normalizedUsername = username.trim().toLowerCase();
  const capped = Math.min(Math.max(1, Math.floor(limit)), 50);
  const params = new URLSearchParams({
    max: String(capped),
    pgnInJson: "true",
    moves: "true",
  });
  const url = `${LICHESS_BASE_URL}/api/games/user/${encodeURIComponent(normalizedUsername)}?${params.toString()}`;

  const response = await lichessFetch(url, {
    headers: { Accept: "application/x-ndjson" },
  });
  const text = await response.text();

  return parseNdjson(text);
}
