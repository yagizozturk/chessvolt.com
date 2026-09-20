export type ImportedGamePlatform = "chesscom" | "lichess";

export type ImportedGamePlayer = {
  username: string;
  rating: number | null;
  result: string;
};

export type ImportedGame = {
  id: string;
  platform: ImportedGamePlatform;
  url: string;
  endTime: number;
  timeClass: string;
  rated: boolean;
  white: ImportedGamePlayer;
  black: ImportedGamePlayer;
  pgn: string;
};

export const IMPORTED_GAMES_LIMIT = 10;
