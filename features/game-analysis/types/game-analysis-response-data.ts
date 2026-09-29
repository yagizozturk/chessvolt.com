import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";

export type GameAnalysisResponseData = {
  moveCount: number;
  depth: number;
  criticalMoments: CriticalMoment[];
};
