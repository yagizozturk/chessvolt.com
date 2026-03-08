import type { Rep } from "@/lib/model/reps";

type DbRep = {
  id: string;
  moves: string;
  opening_name: string | null;
  title: string;
  ply: number | null;
  pgn: string | null;
  created_at: string;
};

export function toRep(db: DbRep): Rep {
  return {
    id: db.id,
    moves: db.moves,
    openingName: db.opening_name,
    title: db.title,
    ply: db.ply,
    pgn: db.pgn,
    createdAt: db.created_at,
  };
}
