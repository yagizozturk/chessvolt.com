import { getEmbeddedMoveSequence } from "@/features/move-sequence/helpers/get-embedded-move-sequence";
import { toMoveSequence, type DbMoveSequence } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";

type DbGameRiddle = {
  id: string;
  game_id: string;
  title: string;
  game_type: string | null;
  themes: string[] | null;
  is_active: boolean;
  created_at: string;
  move_sequences?: DbMoveSequence | DbMoveSequence[] | null;
};

export function toGameRiddle(db: DbGameRiddle): GameRiddle {
  const seqRow = getEmbeddedMoveSequence(db.move_sequences);
  if (!seqRow) {
    throw new Error(`game_riddle ${db.id}: missing move_sequences join`);
  }

  return {
    id: db.id,
    gameId: db.game_id,
    title: db.title,
    gameType: db.game_type,
    themes: db.themes ?? [],
    isActive: db.is_active,
    moveSequence: toMoveSequence(seqRow),
    createdAt: db.created_at,
  };
}
