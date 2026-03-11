import type { Game } from "@/lib/shared/types/game";

type DbGame = {
  id: string;
  white_player: string;
  black_player: string;
  pgn: string;
  result: string;
  played_at: string;
  url: string | null;
  created_at: string;
  event: string | null;
  opening: string | null;
  description: string | null;
};

export function toGame(db: DbGame): Game {
  return {
    id: db.id,
    whitePlayer: db.white_player,
    blackPlayer: db.black_player,
    pgn: db.pgn,
    result: db.result,
    playedAt: db.played_at,
    url: db.url,
    createdAt: db.created_at,
    event: db.event,
    opening: db.opening,
    description: db.description ?? null,
  };
}
