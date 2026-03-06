/**
 * Game Riddle Repository
 *
 * Responsibility: CRUD access to the game_riddles table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { GameRiddle } from "@/lib/model/game-riddle";
import { toGameRiddle } from "@/lib/mappers/game-riddle";

export async function findAll(
  supabase: SupabaseClient
): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*")
    .order("ply", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findAll error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export async function findById(
  supabase: SupabaseClient,
  id: string
): Promise<GameRiddle | null> {
  const { data, error } = await supabase
    .from("game_riddles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("game-riddle.repository.findById error:", error);
    }
    return null;
  }

  if (!data) return null;

  return toGameRiddle(data);
}

export async function findByGameId(
  supabase: SupabaseClient,
  gameId: string
): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*")
    .eq("game_id", gameId)
    .order("ply", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findByGameId error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export async function findByCreatedBy(
  supabase: SupabaseClient,
  userId: string
): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("game-riddle.repository.findByCreatedBy error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export async function findByGameType(
  supabase: SupabaseClient,
  gameType: string
): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*")
    .eq("game_type", gameType)
    .order("ply", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findByGameType error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}
