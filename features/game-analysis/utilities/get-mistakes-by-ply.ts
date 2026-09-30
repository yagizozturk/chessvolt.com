import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";

export type PlayableQuestion = {
  mistake: GameAnalysisMistake;
  moment: CriticalMoment;
};

export function getMistakesByPly(analysis: GameAnalysisWithMistakes): PlayableQuestion[] {
  const momentByPly = new Map(analysis.criticalMoments.map((moment) => [moment.ply, moment]));

  return analysis.questions.flatMap((mistake) => {
    const moment = momentByPly.get(mistake.ply);
    if (!moment?.bestUci.trim()) return [];
    return [{ mistake, moment }];
  });
}
