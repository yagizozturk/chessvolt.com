export type OpeningVariant = {
  id: string;
  openingId: string;
  parentVariantId: string | null;
  title: string | null;
  description: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initialFen: string;
  displayFen: string | null;
  createdAt: string;
};
