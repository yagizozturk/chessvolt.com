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
