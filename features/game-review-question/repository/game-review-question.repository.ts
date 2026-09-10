/**
 * Game Review Question Repository
 *
 * Responsibility: CRUD access to the game_review_questions table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbGameReviewQuestion,
  toGameReviewQuestion,
} from "@/features/game-review-question/mapper/game-review-question.mapper";
import type {
  GameReviewQuestion,
  SaveGameReviewQuestionInput,
} from "@/features/game-review-question/types/game-review-question";

export async function findById(supabase: SupabaseClient, id: string): Promise<GameReviewQuestion | null> {
  const { data, error } = await supabase.from("game_review_questions").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("game-review-question.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toGameReviewQuestion(data as DbGameReviewQuestion);
}

export async function findByUserId(supabase: SupabaseClient, userId: string): Promise<GameReviewQuestion[]> {
  const { data, error } = await supabase
    .from("game_review_questions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("game-review-question.repository.findByUserId error:", error);
    return [];
  }

  return (data ?? []).map((row) => toGameReviewQuestion(row as DbGameReviewQuestion));
}

export async function findByGameAnalysisId(
  supabase: SupabaseClient,
  gameAnalysisId: string,
): Promise<GameReviewQuestion[]> {
  const { data, error } = await supabase
    .from("game_review_questions")
    .select("*")
    .eq("game_analysis_id", gameAnalysisId)
    .order("ply", { ascending: true });

  if (error) {
    console.error("game-review-question.repository.findByGameAnalysisId error:", error);
    return [];
  }

  return (data ?? []).map((row) => toGameReviewQuestion(row as DbGameReviewQuestion));
}

export async function create(
  supabase: SupabaseClient,
  input: SaveGameReviewQuestionInput,
): Promise<GameReviewQuestion | null> {
  const { data, error } = await supabase
    .from("game_review_questions")
    .insert({
      user_id: input.userId,
      game_analysis_id: input.gameAnalysisId ?? null,
      move_sequence_id: input.moveSequenceId,
      game_id: input.gameId,
      source: input.source,
      title: input.title,
      ply: input.ply,
      quality: input.quality,
    })
    .select()
    .single();

  if (error) {
    console.error("game-review-question.repository.create error:", error);
    return null;
  }

  return toGameReviewQuestion(data as DbGameReviewQuestion);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("game_review_questions").delete().eq("id", id);

  if (error) {
    console.error("game-review-question.repository.remove error:", error);
    return false;
  }

  return true;
}
