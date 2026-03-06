/**
 * Game Repository
 *
 * Responsibility: CRUD access to the games table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Game } from "@/lib/model/game";
import { toGame } from "@/lib/mappers/game";

export async function findAll(
  supabase: SupabaseClient
): Promise<Game[]> {
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .order("played_at", { ascending: false });

  if (error) {
    console.error("game.repository.findAll error:", error);
    return [];
  }

  return (games ?? []).map(toGame);
}

export async function findById(
  supabase: SupabaseClient,
  id: string
): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("game.repository.findById error:", error);
    }
    return null;
  }

  if (!data) return null;

  return toGame(data);
}

export async function findByCreatedBy(
  supabase: SupabaseClient,
  userId: string
): Promise<Game[]> {
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("created_by", userId)
    .order("played_at", { ascending: false });

  if (error) {
    console.error("game.repository.findByCreatedBy error:", error);
    return [];
  }

  return (games ?? []).map(toGame);
}
