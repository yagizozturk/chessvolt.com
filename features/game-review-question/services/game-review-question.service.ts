/**
 * Game Review Question Service
 *
 * Responsibility: Game review question business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameReviewQuestionRepo from "@/features/game-review-question/repository/game-review-question.repository";
import type {
  GameReviewQuestion,
  SaveGameReviewQuestionInput,
} from "@/features/game-review-question/types/game-review-question";

export async function getGameReviewQuestionById(
  supabase: SupabaseClient,
  id: string,
): Promise<GameReviewQuestion | null> {
  return gameReviewQuestionRepo.findById(supabase, id);
}

export async function getGameReviewQuestionsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<GameReviewQuestion[]> {
  return gameReviewQuestionRepo.findByUserId(supabase, userId);
}

export async function getGameReviewQuestionsByAnalysisId(
  supabase: SupabaseClient,
  gameAnalysisId: string,
): Promise<GameReviewQuestion[]> {
  return gameReviewQuestionRepo.findByGameAnalysisId(supabase, gameAnalysisId);
}

export async function saveGameReviewQuestion(
  supabase: SupabaseClient,
  input: SaveGameReviewQuestionInput,
): Promise<GameReviewQuestion | null> {
  return gameReviewQuestionRepo.create(supabase, input);
}

export async function deleteGameReviewQuestion(supabase: SupabaseClient, id: string): Promise<boolean> {
  return gameReviewQuestionRepo.remove(supabase, id);
}
