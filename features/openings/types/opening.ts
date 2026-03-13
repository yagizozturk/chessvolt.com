/** Opening model - matches public.openings table (parent of opening_variants) */
export type Opening = {
  id: string;
  name: string;
  slug: string | null;
  ecoCode: string | null;
  description: string | null;
  fen: string | null;
  createdAt: string;
  createdBy: string | null;
};
