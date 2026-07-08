// TODO: Refactor
import { getEmbeddedMoveSequence } from "@/features/move-sequence/helpers/get-embedded-move-sequence";
import { type DbMoveSequence, toMoveSequence } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type { Riddle } from "@/features/riddle/types/riddle";
import { parseRiddleRating } from "@/features/riddle/types/riddle-rating";
import { parseRiddlePopularity } from "@/features/riddle/utilities/parse-riddle-popularity";

export type DbRiddle = {
  id: string;
  game_id: string | null;
  source_id: string | null;
  source: string | null;
  title: string;
  rating: number | null;
  popularity: number | null;
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
    sourceId: db.source_id,
    source: db.source,
    title: db.title,
    rating: parseRiddleRating(db.rating),
    popularity: parseRiddlePopularity(db.popularity),
    isActive: db.is_active,
    moveSequence: toMoveSequence(seqRow),
    createdAt: db.created_at,
  };
}
