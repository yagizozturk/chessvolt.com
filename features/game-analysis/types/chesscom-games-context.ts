import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";

// ====================================================================================================
// Shape of the value shared by ChesscomGamesContext.
// Pages under /game-analysis use it to read the loaded games, replace them, or find one game by uuid.
// ====================================================================================================
export type ChessComGamesContextValue = {
  chessComGames: ChessComGame[];
  setChessComGames: (games: ChessComGame[]) => void;
  findGame: (uuid: string) => ChessComGame | undefined;
};
