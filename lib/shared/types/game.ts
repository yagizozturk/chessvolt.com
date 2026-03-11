export type Game = {
  id: string;
  whitePlayer: string;
  blackPlayer: string;
  pgn: string;
  result: string;
  playedAt: string;
  url: string | null;
  createdAt: string;
  event: string | null;
  opening: string | null;
  description: string | null;
};
