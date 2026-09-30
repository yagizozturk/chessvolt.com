/**
 * Game Analysis Mistake Repository
 *
 * Responsibility: CRUD access to the game_analysis_mistakes table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbGameAnalysisMistake,
  toGameAnalysisMistake,
} from "@/features/game-analysis-mistakes/mapper/game-analysis-mistake.mapper";
import type {
  GameAnalysisMistake,
  GameAnalysisMistakePayload,
} from "@/features/game-analysis-mistakes/types/game-analysis-mistake";

const QUESTION_SELECT = "*";

export async function findById(supabase: SupabaseClient, id: string): Promise<GameAnalysisMistake | null> {
  const { data, error } = await supabase
    .from("game_analysis_mistakes")
    .select(QUESTION_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("game-analysis-mistake.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toGameAnalysisMistake(data as DbGameAnalysisMistake);
}

export async function findByUserId(supabase: SupabaseClient, userId: string): Promise<GameAnalysisMistake[]> {
  const { data, error } = await supabase
    .from("game_analysis_mistakes")
    .select(QUESTION_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("game-analysis-mistake.repository.findByUserId error:", error);
    return [];
  }

  return (data ?? []).map((row) => toGameAnalysisMistake(row as DbGameAnalysisMistake));
}

export async function findByGameAnalysisId(
  supabase: SupabaseClient,
  gameAnalysisId: string,
): Promise<GameAnalysisMistake[]> {
  const { data, error } = await supabase
    .from("game_analysis_mistakes")
    .select(QUESTION_SELECT)
    .eq("game_analysis_id", gameAnalysisId)
    .order("ply", { ascending: true });

  if (error) {
    console.error("game-analysis-mistake.repository.findByGameAnalysisId error:", error);
    return [];
  }

  return (data ?? []).map((row) => toGameAnalysisMistake(row as DbGameAnalysisMistake));
}

export async function findByUserGameId(
  supabase: SupabaseClient,
  userId: string,
  gameId: string,
): Promise<GameAnalysisMistake[]> {
  const { data, error } = await supabase
    .from("game_analysis_mistakes")
    .select(QUESTION_SELECT)
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .order("ply", { ascending: true });

  if (error) {
    console.error("game-analysis-mistake.repository.findByUserGameId error:", error);
    return [];
  }

  return (data ?? []).map((row) => toGameAnalysisMistake(row as DbGameAnalysisMistake));
}

export async function create(
  supabase: SupabaseClient,
  input: GameAnalysisMistakePayload,
): Promise<GameAnalysisMistake | null> {
  const { data, error } = await supabase
    .from("game_analysis_mistakes")
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
    .select(QUESTION_SELECT)
    .single();

  if (error) {
    console.error("game-analysis-mistake.repository.create error:", error);
    return null;
  }

  return toGameAnalysisMistake(data as DbGameAnalysisMistake);
}

export async function upsert(
  supabase: SupabaseClient,
  input: GameAnalysisMistakePayload,
): Promise<GameAnalysisMistake | null> {
  const { data, error } = await supabase
    .from("game_analysis_mistakes")
    .upsert(
      {
        user_id: input.userId,
        game_analysis_id: input.gameAnalysisId ?? null,
        move_sequence_id: input.moveSequenceId,
        game_id: input.gameId,
        source: input.source,
        title: input.title,
        ply: input.ply,
        quality: input.quality,
      },
      { onConflict: "user_id,game_id,ply" },
    )
    .select(QUESTION_SELECT)
    .single();

  if (error) {
    console.error("game-analysis-mistake.repository.upsert error:", error);
    return null;
  }

  return toGameAnalysisMistake(data as DbGameAnalysisMistake);
}

export async function upsertMany(
  supabase: SupabaseClient,
  inputs: GameAnalysisMistakePayload[],
): Promise<GameAnalysisMistake[]> {
  if (inputs.length === 0) return [];

  const { data, error } = await supabase
    .from("game_analysis_mistakes")
    .upsert(
      inputs.map((input) => ({
        user_id: input.userId,
        game_analysis_id: input.gameAnalysisId ?? null,
        move_sequence_id: input.moveSequenceId,
        game_id: input.gameId,
        source: input.source,
        title: input.title,
        ply: input.ply,
        quality: input.quality,
      })),
      { onConflict: "user_id,game_id,ply" },
    )
    .select(QUESTION_SELECT);

  if (error || !data) {
    console.error("game-analysis-mistake.repository.upsertMany error:", error);
    return [];
  }

  return data.map((row) => toGameAnalysisMistake(row as DbGameAnalysisMistake));
}

export async function removeByUserGameId(
  supabase: SupabaseClient,
  userId: string,
  gameId: string,
): Promise<boolean> {
  const { error } = await supabase.from("game_analysis_mistakes").delete().eq("user_id", userId).eq("game_id", gameId);

  if (error) {
    console.error("game-analysis-mistake.repository.removeByUserGameId error:", error);
    return false;
  }

  return true;
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("game_analysis_mistakes").delete().eq("id", id);

  if (error) {
    console.error("game-analysis-mistake.repository.remove error:", error);
    return false;
  }

  return true;
}
