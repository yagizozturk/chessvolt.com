import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";

// ====================================================================================================
// Shape of the value shared by ChesscomGamesContext.
// Pages under /game-analysis use it to read the loaded games, the typed Chess.com username, or find one game by uuid.
// ====================================================================================================
export type ChessComGamesContextValue = {
  chessComGames: ChessComGame[];
  setChessComGames: (games: ChessComGame[]) => void;
  chessComUsername: string;
  setChessComUsername: (username: string) => void;
  findGame: (uuid: string) => ChessComGame | undefined;
};
