import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";

export type GameAnalysisWithMistakes = {
  moveCount: number;
  criticalMoments: CriticalMoment[];
  questions: GameAnalysisMistake[];
  favoritedMistakeIds: string[];
};
