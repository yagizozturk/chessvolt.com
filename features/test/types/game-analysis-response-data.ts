import type { CriticalMoment } from "@/features/test/types/critical-moment";

export type GameAnalysisResponseData = {
  moveCount: number;
  depth: number;
  criticalMoments: CriticalMoment[];
};
