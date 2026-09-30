/**
 * Game Analysis Mistake Service
 *
 * Responsibility: Game analysis mistake business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameAnalysisMistakeRepo from "@/features/game-analysis-mistakes/repository/game-analysis-mistake.repository";
import type {
  GameAnalysisMistake,
  GameAnalysisMistakePayload,
} from "@/features/game-analysis-mistakes/types/game-analysis-mistake";

export async function getGameAnalysisMistakeById(
  supabase: SupabaseClient,
  id: string,
): Promise<GameAnalysisMistake | null> {
  return gameAnalysisMistakeRepo.findById(supabase, id);
}

export async function getGameAnalysisMistakesForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<GameAnalysisMistake[]> {
  return gameAnalysisMistakeRepo.findByUserId(supabase, userId);
}

export async function getGameAnalysisMistakesByAnalysisId(
  supabase: SupabaseClient,
  gameAnalysisId: string,
): Promise<GameAnalysisMistake[]> {
  return gameAnalysisMistakeRepo.findByGameAnalysisId(supabase, gameAnalysisId);
}

// ================================================================================================
// Hataları gameId ye ve user a öre getirmesi için repo ile konuşur.
// ================================================================================================
export async function getGameAnalysisMistakesByGameId(
  supabase: SupabaseClient,
  userId: string,
  gameId: string,
): Promise<GameAnalysisMistake[]> {
  return gameAnalysisMistakeRepo.findByUserGameId(supabase, userId, gameId);
}

export async function saveGameAnalysisMistake(
  supabase: SupabaseClient,
  input: GameAnalysisMistakePayload,
): Promise<GameAnalysisMistake | null> {
  return gameAnalysisMistakeRepo.create(supabase, input);
}

export async function upsertGameAnalysisMistake(
  supabase: SupabaseClient,
  input: GameAnalysisMistakePayload,
): Promise<GameAnalysisMistake | null> {
  return gameAnalysisMistakeRepo.upsert(supabase, input);
}

export async function upsertGameAnalysisMistakes(
  supabase: SupabaseClient,
  inputs: GameAnalysisMistakePayload[],
): Promise<GameAnalysisMistake[]> {
  return gameAnalysisMistakeRepo.upsertMany(supabase, inputs);
}

export async function deleteGameAnalysisMistakesForGame(
  supabase: SupabaseClient,
  userId: string,
  gameId: string,
): Promise<boolean> {
  return gameAnalysisMistakeRepo.removeByUserGameId(supabase, userId, gameId);
}

export async function deleteGameAnalysisMistake(supabase: SupabaseClient, id: string): Promise<boolean> {
  return gameAnalysisMistakeRepo.remove(supabase, id);
}
