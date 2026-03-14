import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";

type DbGameRiddle = {
  id: string;
  game_id: string;
  title: string;
  moves: string | null;
  game_type: string | null;
  display_fen: string | null;
  created_at: string;
};

export function toGameRiddle(db: DbGameRiddle): GameRiddle {
  return {
    id: db.id,
    gameId: db.game_id,
    title: db.title,
    moves: db.moves,
    gameType: db.game_type,
    displayFen: db.display_fen,
    createdAt: db.created_at,
  };
}
