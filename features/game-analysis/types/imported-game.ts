export type ImportedGamePlayer = {
  username: string;
  rating: number | null;
  result: string;
};

export type ImportedGame = {
  id: string;
  platform: "chesscom" | "lichess";
  url: string;
  endTime: number;
  timeClass: string;
  rated: boolean;
  white: ImportedGamePlayer;
  black: ImportedGamePlayer;
  pgn: string;
};
