import type { SupabaseClient } from "@supabase/supabase-js";

import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import { saveGameReviewQuestion } from "@/features/game-review-question/services/game-review-question.service";
import type {
  GameReviewQuestion,
  GameReviewQuestionQuality,
} from "@/features/game-review-question/types/game-review-question";
import type { CriticalMoment } from "@/features/game-review/types/game-review";
import { createMoveSequence } from "@/features/move-sequence/services/move-sequence.service";
import { buildStubGoalsFromMoves } from "@/lib/move-sequence-goals/build-stub-goals";
import { createAdminClient } from "@/lib/supabase/admin";

function reviewQuestionSource(source: GameAnalysisSource, username: string): string {
  const trimmed = username.trim();
  return source === "chesscom" ? `chess-com-${trimmed}-puzzle` : `lichess-${trimmed}-puzzle`;
}

function isQuestionQuality(quality: CriticalMoment["quality"]): quality is GameReviewQuestionQuality {
  return quality === "mistake" || quality === "blunder";
}

export async function createReviewQuestions(input: {
  supabase: SupabaseClient;
  userId: string;
  username: string;
  source: GameAnalysisSource;
  gameId: string;
  gameAnalysisId?: string | null;
  moments: CriticalMoment[];
}): Promise<GameReviewQuestion[]> {
  const username = input.username.trim();
  const gameId = input.gameId.trim();
  if (!username || !gameId || input.moments.length === 0) return [];

  const admin = createAdminClient();
  const source = reviewQuestionSource(input.source, username);
  const questions: GameReviewQuestion[] = [];

  for (const moment of input.moments) {
    const bestUci = moment.bestUci.trim();
    if (!bestUci || !isQuestionQuality(moment.quality)) continue;

    const moveSequence = await createMoveSequence(admin, {
      initialFen: moment.fen,
      displayFen: moment.fen,
      moves: bestUci,
      goals: buildStubGoalsFromMoves(moment.fen, bestUci),
    });

    if (!moveSequence) {
      console.error("create-review-questions: failed to create move sequence", {
        userId: input.userId,
        source,
        gameId,
        ply: moment.ply,
      });
      continue;
    }

    const question = await saveGameReviewQuestion(input.supabase, {
      userId: input.userId,
      gameAnalysisId: input.gameAnalysisId ?? null,
      moveSequenceId: moveSequence.id,
      gameId,
      source,
      title: moment.bestSan ? `Find ${moment.bestSan}` : "Find the better move",
      ply: moment.ply,
      quality: moment.quality,
    });

    if (!question) {
      console.error("create-review-questions: failed to create question", {
        userId: input.userId,
        source,
        gameId,
        ply: moment.ply,
        moveSequenceId: moveSequence.id,
      });
    } else {
      questions.push(question);
    }
  }

  return questions;
}
