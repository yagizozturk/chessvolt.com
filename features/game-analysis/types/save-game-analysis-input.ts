import type { GameAnalysisData } from "@/features/game-analysis/types/game-analysis-data";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";

export type CreateGameAnalysisData = {
  userId: string;
  gameId: string;
  source: GameAnalysisSource;
  data: GameAnalysisData;
};
