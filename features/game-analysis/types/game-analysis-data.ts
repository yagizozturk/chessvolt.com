import type { GameReviewResult } from "@/features/game-review/types/game-review";

export type GameAnalysisData = GameReviewResult & {
  pgn?: string;
};
