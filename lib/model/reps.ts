/** Repertoire (opening repertoire) model - matches public.reps table */
export type Rep = {
  id: string;
  fen: string | null;
  moves: string;
  openingTags: string[] | null;
  title: string;
};
