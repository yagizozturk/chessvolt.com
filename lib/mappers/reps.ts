import type { Rep } from "@/lib/model/reps";

type DbRep = {
  id: string;
  fen: string | null;
  moves: string;
  opening_tags: string[] | null;
  title: string;
};

export function toRep(db: DbRep): Rep {
  return {
    id: db.id,
    fen: db.fen,
    moves: db.moves,
    openingTags: db.opening_tags,
    title: db.title,
  };
}
