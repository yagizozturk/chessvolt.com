import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameAnalysisRepo from "@/features/test/repository/game-analysis.repository";
import type { CreateGameAnalysisData } from "@/features/test/types/create-game-analysis-data";
import type { GameAnalysis } from "@/features/test/types/game-analysis";
import type { GameAnalysisSource } from "@/features/test/types/game-analysis-source";

export async function getGameAnalysis(
  supabase: SupabaseClient,
  userId: string,
  source: GameAnalysisSource,
  gameId: string,
): Promise<GameAnalysis | null> {
  return gameAnalysisRepo.findByUserSourceAndGameId(supabase, userId, source, gameId);
}

export async function saveGameAnalysis(
  supabase: SupabaseClient,
  data: CreateGameAnalysisData,
): Promise<GameAnalysis | null> {
  return gameAnalysisRepo.upsert(supabase, data);
}

export async function deleteGameAnalysis(supabase: SupabaseClient, id: string): Promise<boolean> {
  return gameAnalysisRepo.remove(supabase, id);
}
