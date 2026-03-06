export type Puzzle = {
  id: string;
  sourceLocalId: string | null;
  fen: string;
  moves: string;
  rating: number | null;
  ratingDeviation: number | null;
  popularity: number | null;
  nbPlays: number | null;
  themes: string[] | null;
  gameUrl: string | null;
  openingTags: string[] | null;
  source: string | null;
};

export type UserPuzzleStats = {
  totalPuzzles: number;
  attempted: number;
  solved: number;
  failed: number;
  solveRate: number;
};
