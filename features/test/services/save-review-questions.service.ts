import type { SupabaseClient } from "@supabase/supabase-js";

import { upsertGameReviewQuestion } from "@/features/game-review-question/services/game-review-question.service";
import type { GameReviewQuestionQuality } from "@/features/game-review-question/types/game-review-question";
import type { CriticalMoment } from "@/features/test/types/critical-moment";
import type { GameAnalysisSource } from "@/features/test/types/game-analysis-source";
import { playerColorFromPgn } from "@/features/test/utilities/player-color-from-pgn";

function isQuestionQuality(quality: CriticalMoment["quality"]): quality is GameReviewQuestionQuality {
  return quality === "mistake" || quality === "blunder";
}

export async function saveReviewQuestions(input: {
  supabase: SupabaseClient;
  userId: string;
  username: string;
  pgn: string;
  source: GameAnalysisSource;
  gameId: string;
  gameAnalysisId: string;
  moments: CriticalMoment[];
}): Promise<number> {
  const userColor = playerColorFromPgn(input.pgn, input.username);
  if (!userColor) return 0;

  let savedCount = 0;

  for (const moment of input.moments) {
    if (moment.turn !== userColor || !moment.bestUci.trim() || !isQuestionQuality(moment.quality)) continue;

    const question = await upsertGameReviewQuestion(input.supabase, {
      userId: input.userId,
      gameAnalysisId: input.gameAnalysisId,
      gameId: input.gameId,
      source: input.source,
      title: moment.playedSan ? `Played ${moment.playedSan}` : "Original game move",
      ply: moment.ply,
      quality: moment.quality,
    });

    if (question) savedCount += 1;
  }

  return savedCount;
}
