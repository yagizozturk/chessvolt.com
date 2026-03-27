/** One learning goal row stored in `opening_variants.goals` (jsonb array). */
export type OpeningVariantGoal = {
  sort_key: number;
  move: string;
  card: string;
  title: string;
  description: string;
};

export type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: number;
  title: string | null;
  description: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initialFen: string;
  displayFen: string | null;
  goals: OpeningVariantGoal[] | null;
  createdAt: string;
};
