import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameAnalysisRepo from "@/features/game-analysis/repository/game-analysis.repository";
import type { CreateGameAnalysisData } from "@/features/game-analysis/types/create-game-analysis-data";
import type { GameAnalysis } from "@/features/game-analysis/types/game-analysis";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";

export async function getGameAnalysis(
  supabase: SupabaseClient,
  userId: string,
  source: GameAnalysisSource,
  gameId: string,
): Promise<GameAnalysis | null> {
  return gameAnalysisRepo.findByUserSourceAndGameId(supabase, userId, source, gameId);
}

// ================================================================================================
// Oyun analizini DB'ye kaydetmek için repo ile konuşur.
// ================================================================================================
export async function saveGameAnalysis(
  supabase: SupabaseClient,
  data: CreateGameAnalysisData,
): Promise<GameAnalysis | null> {
  return gameAnalysisRepo.upsert(supabase, data);
}

export async function deleteGameAnalysis(supabase: SupabaseClient, id: string): Promise<boolean> {
  return gameAnalysisRepo.remove(supabase, id);
}
