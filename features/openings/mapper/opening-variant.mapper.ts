// TODO: Refactor
import { getEmbeddedMoveSequence } from "@/features/move-sequence/helpers/get-embedded-move-sequence";
import { toMoveSequence, type DbMoveSequence } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";

export type DbOpeningVariant = {
  id: string;
  opening_id: string;
  sort_key: number;
  title: string | null;
  description: string | null;
  initial_ply: number;
  created_at: string;
  move_sequences?: DbMoveSequence | DbMoveSequence[] | null;
};

export function toOpeningVariant(db: DbOpeningVariant): OpeningVariant {
  const seqRow = getEmbeddedMoveSequence(db.move_sequences);
  if (!seqRow) {
    throw new Error(`opening_variant ${db.id}: missing move_sequences join`);
  }

  return {
    id: db.id,
    openingId: db.opening_id,
    sortKey: db.sort_key,
    title: db.title,
    description: db.description ?? null,
    initialPly: db.initial_ply ?? 0,
    moveSequence: toMoveSequence(seqRow),
    createdAt: db.created_at,
  };
}

export function getPgnFromVariant(variant: OpeningVariant): string {
  return variant.moveSequence.pgn ?? "";
}
