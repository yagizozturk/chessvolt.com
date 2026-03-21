import type { OpeningVariant } from "@/features/openings/types/opening-variant";

type DbOpeningVariant = {
  id: string;
  opening_id: string;
  sort_key: number;
  title: string | null;
  description: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initial_fen: string;
  display_fen: string | null;
  created_at: string;
};

export function toOpeningVariant(db: DbOpeningVariant): OpeningVariant {
  return {
    id: db.id,
    openingId: db.opening_id,
    sortKey: db.sort_key,
    title: db.title,
    description: db.description ?? null,
    ply: db.ply ?? 0,
    moves: db.moves,
    pgn: db.pgn,
    initialFen:
      db.initial_fen ??
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    displayFen: db.display_fen ?? null,
    createdAt: db.created_at,
  };
}

/** Returns PGN for display. */
export function getPgnFromVariant(variant: OpeningVariant): string {
  return variant.pgn;
}
