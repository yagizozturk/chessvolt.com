import type { ChesscomRealGame } from "@/features/game-analysis/types/chesscom-real-game";

// ====================================================================================================
// Shape of the value shared by ChesscomGamesContext.
// Pages under /game-analysis use it to read the loaded games, replace them, or find one game by uuid.
// ====================================================================================================
export type ChesscomGamesContextValue = {
  games: ChesscomRealGame[];
  setGames: (games: ChesscomRealGame[]) => void;
  findGame: (uuid: string) => ChesscomRealGame | undefined;
};
