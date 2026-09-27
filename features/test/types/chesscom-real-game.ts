export type ChesscomRealGame = {
  uuid: string;
  url: string;
  pgn: string;
  fen: string;
  end_time: number;
  time_class: string;
  white: { username: string };
  black: { username: string };
};
