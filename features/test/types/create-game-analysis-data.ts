import type { GameAnalysisResponseData } from "@/features/test/types/game-analysis-response-data";
import type { GameAnalysisSource } from "@/features/test/types/game-analysis-source";

export type CreateGameAnalysisData = {
  userId: string;
  gameId: string;
  source: GameAnalysisSource;
  data: GameAnalysisResponseData;
};
