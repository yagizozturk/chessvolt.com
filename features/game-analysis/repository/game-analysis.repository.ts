/**
 * Game Analysis Repository
 *
 * Responsibility: CRUD access to the game_analyses table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { type DbGameAnalysis, toGameAnalysis } from "@/features/game-analysis/mapper/game-analysis.mapper";
import type {
  GameAnalysis,
  GameAnalysisSource,
  SaveGameAnalysisInput,
} from "@/features/game-analysis/types/game-analysis";

export async function findById(supabase: SupabaseClient, id: string): Promise<GameAnalysis | null> {
  const { data, error } = await supabase.from("game_analyses").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("game-analysis.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toGameAnalysis(data as DbGameAnalysis);
}

export async function findByUserId(supabase: SupabaseClient, userId: string): Promise<GameAnalysis[]> {
  const { data, error } = await supabase
    .from("game_analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("game-analysis.repository.findByUserId error:", error);
    return [];
  }

  return (data ?? []).map((row) => toGameAnalysis(row as DbGameAnalysis));
}

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

  if (error) {
    console.error("game-analysis.repository.findByUserSourceAndGameId error:", error);
    return null;
  }

  if (!data) return null;

  return toGameAnalysis(data as DbGameAnalysis);
}

export async function upsert(supabase: SupabaseClient, input: SaveGameAnalysisInput): Promise<GameAnalysis | null> {
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

  if (error) {
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
