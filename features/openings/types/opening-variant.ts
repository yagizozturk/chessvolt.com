export type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: string;
  title: string | null;
  description: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initialFen: string;
  displayFen: string | null;
  createdAt: string;
};
