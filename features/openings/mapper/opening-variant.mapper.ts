import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { isMoveGoalsArray } from "@/features/openings/validation/opening-variant-goals";
import { isOpeningIdeas } from "@/features/openings/validation/opening-variant-ideas";

type DbOpeningVariant = {
  id: string;
  opening_id: string;
  sort_key: number;
  group: string | null;
  title: string | null;
  description: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initial_fen: string;
  display_fen: string | null;
  goals?: unknown;
  ideas?: unknown;
  created_at: string;
};

export function toOpeningVariant(db: DbOpeningVariant): OpeningVariant {
  return {
    id: db.id,
    openingId: db.opening_id,
    sortKey: db.sort_key,
    group: db.group ?? "",
    title: db.title,
    description: db.description ?? null,
    ply: db.ply ?? 0,
    moves: db.moves,
    pgn: db.pgn,
    initialFen:
      db.initial_fen ??
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    displayFen: db.display_fen ?? null,
    goals:
      db.goals != null && isMoveGoalsArray(db.goals)
        ? db.goals
        : null,
    ideas:
      db.ideas != null && isOpeningIdeas(db.ideas)
        ? db.ideas
        : null,
    createdAt: db.created_at,
  };
}

/** Returns PGN for display. */
export function getPgnFromVariant(variant: OpeningVariant): string {
  return variant.pgn;
}
