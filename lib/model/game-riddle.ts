export type GameRiddle = {
  id: string;
  gameId: string;
  ply: number;
  title: string;
  fen: string | null;
  moves: string | null;
  gameType: string | null;
  createdAt: string;
};
