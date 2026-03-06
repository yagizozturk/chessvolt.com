export type GameRiddle = {
  id: string;
  gameId: string;
  ply: number;
  title: string;
  fen: string | null;
  moves: string | null;
  rating: number | null;
  gameType: string | null;
  createdAt: string;
  createdBy: string | null;
};
