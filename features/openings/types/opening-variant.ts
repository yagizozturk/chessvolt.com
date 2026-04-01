/** One learning goal row stored in `opening_variants.goals` (jsonb array). */
export type MoveGoal = {
  ply: number;
  move: string;
  card: string;
  title: string;
  description: string;
  isCompleted: boolean;
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
  goals: MoveGoal[] | null;
  createdAt: string;
};
