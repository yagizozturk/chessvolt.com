export type LichessGamePlayer = {
  user?: {
    name?: string;
    id?: string;
  };
  rating?: number;
  ratingDiff?: number;
  aiLevel?: number;
};

export type LichessGame = {
  id: string;
  rated: boolean;
  variant?: string;
  speed?: string;
  perf?: string;
  createdAt?: number;
  lastMoveAt?: number;
  status?: string;
  winner?: "white" | "black";
  players?: {
    white?: LichessGamePlayer;
    black?: LichessGamePlayer;
  };
  pgn?: string;
};

export type LichessPerf = {
  games?: number;
  rating?: number;
  rd?: number;
  prog?: number;
};

export type LichessUser = {
  id: string;
  username: string;
  perfs?: {
    rapid?: LichessPerf;
    blitz?: LichessPerf;
    bullet?: LichessPerf;
    classical?: LichessPerf;
    puzzle?: LichessPerf;
  };
};
