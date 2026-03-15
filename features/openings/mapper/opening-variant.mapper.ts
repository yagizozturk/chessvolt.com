import type { OpeningVariant } from "@/features/openings/types/opening-variant";

type DbOpeningVariant = {
  id: string;
  opening_id: string;
  parent_variant_id: string | null;
  title: string | null;
  eco_code: string | null;
  ply: number;
  moves: string;
  pgn: string;
  fen: string | null;
  created_at: string;
};

export function toOpeningVariant(db: DbOpeningVariant): OpeningVariant {
  return {
    id: db.id,
    openingId: db.opening_id,
    parentVariantId: db.parent_variant_id,
    title: db.title,
    ecoCode: db.eco_code,
    ply: db.ply ?? 0,
    moves: db.moves,
    pgn: db.pgn,
    fen: db.fen ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    createdAt: db.created_at,
  };
}

/** Returns PGN for display. */
export function getPgnFromVariant(variant: OpeningVariant): string {
  return variant.pgn;
}
