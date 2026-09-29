import type { SupabaseClient } from "@supabase/supabase-js";

import { upsertGameReviewQuestion } from "@/features/game-review-question/services/game-review-question.service";
import type {
  GameReviewQuestion,
  GameReviewQuestionQuality,
} from "@/features/game-review-question/types/game-review-question";
import { createMoveSequence } from "@/features/move-sequence/services/move-sequence.service";
import type { CriticalMoment } from "@/features/test/types/critical-moment";
import type { GameAnalysisSource } from "@/features/test/types/game-analysis-source";
import { playerColorFromPgn } from "@/features/test/utilities/player-color-from-pgn";
import { buildStubGoalsFromMoves } from "@/lib/move-sequence-goals/build-stub-goals";
import { createAdminClient } from "@/lib/supabase/admin";

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
}): Promise<GameReviewQuestion[]> {
  const userColor = playerColorFromPgn(input.pgn, input.username);
  if (!userColor) return [];

  const admin = createAdminClient();
  const questions: GameReviewQuestion[] = [];

  for (const moment of input.moments) {
    const bestUci = moment.bestUci.trim();
    if (moment.turn !== userColor || !bestUci || !isQuestionQuality(moment.quality)) continue;

    const moveSequence = await createMoveSequence(admin, {
      initialFen: moment.fen,
      displayFen: moment.fen,
      moves: bestUci,
      goals: buildStubGoalsFromMoves(moment.fen, bestUci),
    });
    if (!moveSequence) continue;

    const question = await upsertGameReviewQuestion(input.supabase, {
      userId: input.userId,
      gameAnalysisId: input.gameAnalysisId,
      moveSequenceId: moveSequence.id,
      gameId: input.gameId,
      source: input.source,
      title: moment.playedSan ? `Played ${moment.playedSan}` : "Original game move",
      ply: moment.ply,
      quality: moment.quality,
    });

    if (question) questions.push(question);
  }

  return questions;
}
