import type { PlatformGame } from "@/features/game-analysis/types/platform-game";

export type PlatformGamesContextValue = {
  chessComGames: PlatformGame[];
  setChessComGames: (games: PlatformGame[]) => void;
  chessComUsername: string;
  setChessComUsername: (username: string) => void;
  lichessGames: PlatformGame[];
  setLichessGames: (games: PlatformGame[]) => void;
  lichessUsername: string;
  setLichessUsername: (username: string) => void;
  findGame: (uuid: string) => PlatformGame | undefined;
};
