import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { movesToPgn } from "@/lib/chess/movesToPgn";

type DbOpeningVariant = {
  id: string;
  opening_id: string;
  parent_variant_id: string | null;
  title: string | null;
  eco_code: string | null;
  moves: string;
  fen: string | null;
  move_count: number | null;
  created_at: string;
  created_by: string | null;
  ply: number;
};

export function toOpeningVariant(db: DbOpeningVariant): OpeningVariant {
  return {
    id: db.id,
    openingId: db.opening_id,
    parentVariantId: db.parent_variant_id,
    title: db.title,
    ecoCode: db.eco_code,
    moves: db.moves,
    fen: db.fen,
    moveCount: db.move_count,
    createdAt: db.created_at,
    createdBy: db.created_by,
    ply: db.ply,
  };
}

/** Derives PGN from moves for display. Opening variants store moves, not PGN. */
export function getPgnFromVariant(variant: OpeningVariant): string {
  return movesToPgn(variant.moves);
}
