import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import type { CriticalMoment } from "@/features/test/types/critical-moment";

export type GameReviewPayload = {
  moveCount: number;
  criticalMoments: CriticalMoment[];
  questions: GameReviewQuestion[];
};
