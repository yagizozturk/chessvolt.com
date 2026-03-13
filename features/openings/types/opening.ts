/** Opening model - matches public.openings table (parent of opening_variants) */
export type Opening = {
  id: string;
  /** e.g. "e4", "d4", "c4" - used for grouping and slug */
  slug: string;
  /** Display name e.g. "King's Pawn", "Queen's Pawn" */
  name: string | null;
};
