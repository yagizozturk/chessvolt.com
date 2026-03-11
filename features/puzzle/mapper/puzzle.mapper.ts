import type { Puzzle } from "@/features/puzzle/types/puzzle";

type DbPuzzle = {
  id: string;
  source_local_id: string | null;
  fen: string;
  moves: string;
  rating: number | null;
  rating_deviation: number | null;
  popularity: number | null;
  nb_plays: number | null;
  themes: string[] | null;
  game_url: string | null;
  opening_tags: string[] | null;
  source: string | null;
};

export function toPuzzle(db: DbPuzzle): Puzzle {
  return {
    id: db.id,
    sourceLocalId: db.source_local_id,
    fen: db.fen,
    moves: db.moves,
    rating: db.rating,
    ratingDeviation: db.rating_deviation,
    popularity: db.popularity,
    nbPlays: db.nb_plays,
    themes: db.themes,
    gameUrl: db.game_url,
    openingTags: db.opening_tags,
    source: db.source,
  };
}
