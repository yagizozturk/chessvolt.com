import type { ChessComStatsCategory } from "@/features/game-analysis/types/chesscom-stats-category";

export type ChessComPlayerStats = {
  chess_rapid?: ChessComStatsCategory;
  chess_blitz?: ChessComStatsCategory;
  chess_bullet?: ChessComStatsCategory;
  chess_daily?: ChessComStatsCategory;
};
