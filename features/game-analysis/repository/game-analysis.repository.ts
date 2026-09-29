import type { SupabaseClient } from "@supabase/supabase-js";

import { type DbGameAnalysis, toGameAnalysis } from "@/features/game-analysis/mapper/game-analysis.mapper";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import type { GameAnalysis } from "@/features/game-analysis/types/game-analysis";
import type { CreateGameAnalysisData } from "@/features/game-analysis/types/create-game-analysis-data";

export async function findByUserSourceAndGameId(
  supabase: SupabaseClient,
  userId: string,
  source: GameAnalysisSource,
  gameId: string,
): Promise<GameAnalysis | null> {
  const { data, error } = await supabase
    .from("game_analyses")
    .select("*")
    .eq("user_id", userId)
    .eq("source", source)
    .eq("game_id", gameId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("game-analysis.repository.findByUserSourceAndGameId error:", error);
    return null;
  }

  return toGameAnalysis(data as DbGameAnalysis);
}

export async function upsert(supabase: SupabaseClient, input: CreateGameAnalysisData): Promise<GameAnalysis | null> {
  const { data, error } = await supabase
    .from("game_analyses")
    .upsert(
      {
        user_id: input.userId,
        game_id: input.gameId,
        source: input.source,
        data: input.data,
      },
      { onConflict: "user_id,source,game_id" },
    )
    .select()
    .single();

  if (error || !data) {
    console.error("game-analysis.repository.upsert error:", error);
    return null;
  }

  return toGameAnalysis(data as DbGameAnalysis);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("game_analyses").delete().eq("id", id);

  if (error) {
    console.error("game-analysis.repository.remove error:", error);
    return false;
  }

  return true;
}
