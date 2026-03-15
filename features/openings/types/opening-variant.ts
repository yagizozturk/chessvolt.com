export type OpeningVariant = {
  id: string;
  openingId: string;
  parentVariantId: string | null;
  title: string | null;
  ecoCode: string | null;
  ply: number;
  moves: string;
  pgn: string;
  fen: string;
  createdAt: string;
};
