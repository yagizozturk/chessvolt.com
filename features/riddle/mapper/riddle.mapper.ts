import { getEmbeddedMoveSequence } from "@/features/move-sequence/helpers/get-embedded-move-sequence";
import { toMoveSequence, type DbMoveSequence } from "@/features/move-sequence/mapper/move-sequence.mapper";
import {
  DEFAULT_RIDDLE_DIFFICULTY,
  parseRiddleDifficulty,
  type RiddleDifficulty,
} from "@/features/riddle/types/riddle-difficulty";
import type { Riddle } from "@/features/riddle/types/riddle";

export type DbRiddle = {
  id: string;
  game_id: string | null;
  title: string;
  description: string | null;
  difficulty: RiddleDifficulty;
  themes: string[] | null;
  is_active: boolean;
  created_at: string;
  move_sequences?: DbMoveSequence | DbMoveSequence[] | null;
};

export function toRiddle(db: DbRiddle): Riddle {
  const seqRow = getEmbeddedMoveSequence(db.move_sequences);
  if (!seqRow) {
    throw new Error(`riddle ${db.id}: missing move_sequences join`);
  }

  return {
    id: db.id,
    gameId: db.game_id,
    title: db.title,
    description: db.description,
    difficulty: parseRiddleDifficulty(db.difficulty) ?? DEFAULT_RIDDLE_DIFFICULTY,
    themes: db.themes ?? [],
    isActive: db.is_active,
    moveSequence: toMoveSequence(seqRow),
    createdAt: db.created_at,
  };
}
