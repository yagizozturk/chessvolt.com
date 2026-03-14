/** Opening model - matches public.openings table (parent of opening_variants) */
export type Opening = {
  id: string;
  name: string;
  slug: string | null;
  ecoCode: string | null;
  description: string | null;
  displayFen: string;
  createdAt: string;
};
