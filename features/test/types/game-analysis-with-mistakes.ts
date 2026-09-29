import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import type { CriticalMoment } from "@/features/test/types/critical-moment";

export type GameAnalysisWithMistakes = {
  moveCount: number;
  criticalMoments: CriticalMoment[];
  questions: GameAnalysisMistake[];
  favoritedQuestionIds: string[];
};
