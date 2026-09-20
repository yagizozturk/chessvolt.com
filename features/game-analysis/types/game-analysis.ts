import type { GameReviewResult } from "@/features/game-review/types/game-review";

export type GameAnalysisSource = "chesscom" | "lichess";

export type GameAnalysisData = GameReviewResult & {
  pgn?: string;
};

export type GameAnalysis = {
  id: string;
  userId: string;
  gameId: string;
  source: GameAnalysisSource;
  data: GameAnalysisData;
  createdAt: string;
  updatedAt: string;
};

export type SaveGameAnalysisInput = {
  userId: string;
  gameId: string;
  source: GameAnalysisSource;
  data: GameAnalysisData;
};

export function isGameAnalysisSource(value: unknown): value is GameAnalysisSource {
  return value === "chesscom" || value === "lichess";
}
