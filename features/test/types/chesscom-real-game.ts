export type ChesscomRealGame = {
  uuid: string;
  url: string;
  pgn: string;
  fen: string;
  end_time: number;
  time_class: string;
  rated?: boolean;
  white: { username: string; rating?: number; result?: string };
  black: { username: string; rating?: number; result?: string };
};
