import type { Rep } from "@/features/reps/types/reps";

type DbRep = {
  id: string;
  moves: string;
  opening_name: string | null;
  opening_type: string | null;
  title: string;
  ply: number | null;
  pgn: string | null;
  display_fen: string | null;
  created_at: string;
};

export function toRep(db: DbRep): Rep {
  return {
    id: db.id,
    moves: db.moves,
    openingName: db.opening_name,
    openingType: db.opening_type,
    title: db.title,
    ply: db.ply,
    pgn: db.pgn,
    displayFen: db.display_fen,
    createdAt: db.created_at,
  };
}
