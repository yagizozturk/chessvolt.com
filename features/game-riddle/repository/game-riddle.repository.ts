/**
 * Game Riddle Repository
 *
 * Responsibility: CRUD access to the game_riddles table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import { toGameRiddle } from "@/features/game-riddle/mapper/game-riddle.mapper";

export async function findAll(supabase: SupabaseClient): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findAll error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export async function findById(
  supabase: SupabaseClient,
  id: string,
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
  gameId: string,
): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findByGameId error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export async function findByGameType(
  supabase: SupabaseClient,
  gameType: string,
): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*")
    .eq("game_type", gameType)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findByGameType error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export type CreateGameRiddleInput = {
  gameId: string;
  title: string;
  moves?: string | null;
  gameType?: string | null;
  displayFen?: string | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateGameRiddleInput,
): Promise<GameRiddle | null> {
  const { data, error } = await supabase
    .from("game_riddles")
    .insert({
      game_id: input.gameId,
      title: input.title,
      moves: input.moves ?? null,
      game_type: input.gameType ?? null,
      display_fen: input.displayFen ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("game-riddle.repository.create error:", error);
    return null;
  }

  return toGameRiddle(data);
}

export type UpdateGameRiddleInput = {
  gameId?: string;
  title?: string;
  moves?: string | null;
  gameType?: string | null;
  displayFen?: string | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateGameRiddleInput,
): Promise<GameRiddle | null> {
  const updates: Record<string, unknown> = {};
  if (input.gameId !== undefined) updates.game_id = input.gameId;
  if (input.title !== undefined) updates.title = input.title;
  if (input.moves !== undefined) updates.moves = input.moves;
  if (input.gameType !== undefined) updates.game_type = input.gameType;
  if (input.displayFen !== undefined) updates.display_fen = input.displayFen;

  const { data, error } = await supabase
    .from("game_riddles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("game-riddle.repository.update error:", error);
    return null;
  }

  return toGameRiddle(data);
}

export async function remove(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from("game_riddles").delete().eq("id", id);

  if (error) {
    console.error("game-riddle.repository.remove error:", error);
    return false;
  }

  return true;
}
