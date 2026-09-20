export type ChessComPlayerResult = {
  username: string;
  rating: number;
  result: string;
  "@id"?: string;
};

export type ChessComGameAccuracies = {
  white: number;
  black: number;
};

export type ChessComGame = {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: ChessComPlayerResult;
  black: ChessComPlayerResult;
  accuracies?: ChessComGameAccuracies;
  tournament?: string;
  match?: string;
  uuid?: string;
};

export type ChessComStatsCategory = {
  last?: {
    rating?: number;
    date?: number;
    rd?: number;
  };
  record?: {
    win?: number;
    loss?: number;
    draw?: number;
  };
};

export type ChessComPlayerStats = {
  chess_rapid?: ChessComStatsCategory;
  chess_blitz?: ChessComStatsCategory;
  chess_bullet?: ChessComStatsCategory;
  chess_daily?: ChessComStatsCategory;
};
