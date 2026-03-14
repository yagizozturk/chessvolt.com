export type GameRiddle = {
  id: string;
  gameId: string;
  title: string;
  moves: string | null;
  gameType: string | null;
  displayFen: string | null;
  createdAt: string;
};
