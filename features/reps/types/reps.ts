/** Repertoire (opening repertoire) model - matches public.reps table */
export type Rep = {
  id: string;
  moves: string;
  openingName: string | null;
  title: string;
  ply: number | null;
  pgn: string | null;
  createdAt: string;
};
