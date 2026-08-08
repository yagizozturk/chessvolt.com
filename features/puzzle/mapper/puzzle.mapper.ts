import { getEmbeddedMoveSequence } from "@/features/move-sequence/helpers/get-embedded-move-sequence";
import { type DbMoveSequence, toMoveSequence } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { parsePuzzleRating } from "@/features/puzzle/types/puzzle-rating";
import { parsePuzzlePopularity } from "@/features/puzzle/utilities/parse-puzzle-popularity";

export type DbPuzzle = {
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

export function toPuzzle(db: DbPuzzle): Puzzle {
  const seqRow = getEmbeddedMoveSequence(db.move_sequences);
  if (!seqRow) {
    throw new Error(`puzzle ${db.id}: missing move_sequences join`);
  }

  return {
    id: db.id,
    gameId: db.game_id,
    sourceId: db.source_id,
    source: db.source,
    title: db.title,
    rating: parsePuzzleRating(db.rating),
    popularity: parsePuzzlePopularity(db.popularity),
    isActive: db.is_active,
    moveSequence: toMoveSequence(seqRow),
    createdAt: db.created_at,
  };
}
