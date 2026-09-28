import type { GameAnalysisResponseData } from "@/features/test/types/game-analysis-response-data";
import type { GameAnalysisSource } from "@/features/test/types/game-analysis-source";

// Saved in game_analyses after chess-api analyzes a game.
// source is chesscom or lichess. gameId is the platform game id. data is the analysis result.
export type GameAnalysis = {
  id: string;
  userId: string;
  gameId: string;
  source: GameAnalysisSource;
  data: GameAnalysisResponseData;
  createdAt: string;
  updatedAt: string;
};
