import type { GameAnalysisData } from "@/features/game-analysis/types/game-analysis-data";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";

// ==========================================================================================
// Game Analysis is saved in DB after a game is analyzed through api of chess-api.com
// source: is whether lichess or chess.com
// gameId: The Id that the platform assigned for the game
// data: What returns from the api call
// ==========================================================================================
export type GameAnalysis = {
  id: string;
  userId: string;
  gameId: string;
  source: GameAnalysisSource;
  data: GameAnalysisData;
  createdAt: string;
  updatedAt: string;
};
