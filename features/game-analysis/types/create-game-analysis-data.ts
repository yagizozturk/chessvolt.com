import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";

export type CreateGameAnalysisData = {
  userId: string;
  gameId: string;
  source: GameAnalysisSource;
  data: GameAnalysisResponseData;
};
