/** Opening variant model - matches public.opening_variants table */
export type OpeningVariant = {
  id: string;
  openingId: string;
  parentVariantId: string | null;
  title: string | null;
  ecoCode: string | null;
  moves: string;
  fen: string;
  moveCount: number | null;
  createdAt: string;
  createdBy: string | null;
  ply: number;
};
