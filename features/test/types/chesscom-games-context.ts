import type { ChesscomRealGame } from "@/features/test/types/chesscom-real-game";

// ====================================================================================================
// Shape of the value shared by ChesscomGamesContext.
// Pages under /test use it to read the loaded games, replace them, or find one game by uuid.
// ====================================================================================================
export type ChesscomGamesContextValue = {
  games: ChesscomRealGame[];
  setGames: (games: ChesscomRealGame[]) => void;
  findGame: (uuid: string) => ChesscomRealGame | undefined;
};
