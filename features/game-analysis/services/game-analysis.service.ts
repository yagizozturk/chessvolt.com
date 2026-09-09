/**
 * Game Analysis Service
 *
 * Responsibility: Game analysis business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameAnalysisRepo from "@/features/game-analysis/repository/game-analysis.repository";
import type {
  GameAnalysis,
  GameAnalysisSource,
  SaveGameAnalysisInput,
} from "@/features/game-analysis/types/game-analysis";

export async function getGameAnalysisById(supabase: SupabaseClient, id: string): Promise<GameAnalysis | null> {
  return gameAnalysisRepo.findById(supabase, id);
}

export async function getGameAnalysesForUser(supabase: SupabaseClient, userId: string): Promise<GameAnalysis[]> {
  return gameAnalysisRepo.findByUserId(supabase, userId);
}

export async function getGameAnalysisByUserSourceAndGame(
  supabase: SupabaseClient,
  userId: string,
  source: GameAnalysisSource,
  gameId: string,
): Promise<GameAnalysis | null> {
  return gameAnalysisRepo.findByUserSourceAndGameId(supabase, userId, source, gameId);
}

export async function saveGameAnalysis(
  supabase: SupabaseClient,
  input: SaveGameAnalysisInput,
): Promise<GameAnalysis | null> {
  return gameAnalysisRepo.upsert(supabase, input);
}

export async function deleteGameAnalysis(supabase: SupabaseClient, id: string): Promise<boolean> {
  return gameAnalysisRepo.remove(supabase, id);
}
