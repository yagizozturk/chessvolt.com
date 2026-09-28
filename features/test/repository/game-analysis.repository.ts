import type { SupabaseClient } from "@supabase/supabase-js";

import { type DbGameAnalysis, toGameAnalysis } from "@/features/game-analysis/mapper/game-analysis.mapper";
import type { GameAnalysis } from "@/features/test/types/game-analysis";
import type { CreateGameAnalysisData } from "@/features/test/types/create-game-analysis-data";

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
    console.error("test game-analysis.repository.upsert error:", error);
    return null;
  }

  return toGameAnalysis(data as DbGameAnalysis);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("game_analyses").delete().eq("id", id);

  if (error) {
    console.error("test game-analysis.repository.remove error:", error);
    return false;
  }

  return true;
}
