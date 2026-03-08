import type { GameRiddle } from "@/lib/model/game-riddle";

type DbGameRiddle = {
  id: string;
  game_id: string;
  ply: number;
  title: string;
  fen: string | null;
  moves: string | null;
  game_type: string | null;
  created_at: string;
  created_by: string | null;
};

export function toGameRiddle(db: DbGameRiddle): GameRiddle {
  return {
    id: db.id,
    gameId: db.game_id,
    ply: db.ply,
    title: db.title,
    fen: db.fen,
    moves: db.moves,
    gameType: db.game_type,
    createdAt: db.created_at,
    createdBy: db.created_by,
  };
}
