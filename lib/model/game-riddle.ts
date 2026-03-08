export type GameRiddle = {
  id: string;
  gameId: string;
  ply: number;
  title: string;
  moves: string | null;
  gameType: string | null;
  createdAt: string;
};
