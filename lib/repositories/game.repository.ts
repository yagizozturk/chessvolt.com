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

export type CreateGameInput = {
  whitePlayer: string;
  blackPlayer: string;
  pgn: string;
  result: string;
  playedAt: string;
  url?: string | null;
  event?: string | null;
  opening?: string | null;
  description?: string | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateGameInput
): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .insert({
      white_player: input.whitePlayer,
      black_player: input.blackPlayer,
      pgn: input.pgn,
      result: input.result,
      played_at: input.playedAt,
      url: input.url ?? null,
      event: input.event ?? null,
      opening: input.opening ?? null,
      description: input.description ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("game.repository.create error:", error);
    return null;
  }

  return toGame(data);
}

export type UpdateGameInput = {
  whitePlayer?: string;
  blackPlayer?: string;
  pgn?: string;
  result?: string;
  playedAt?: string;
  url?: string | null;
  event?: string | null;
  opening?: string | null;
  description?: string | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateGameInput
): Promise<Game | null> {
  const updates: Record<string, unknown> = {};
  if (input.whitePlayer !== undefined) updates.white_player = input.whitePlayer;
  if (input.blackPlayer !== undefined) updates.black_player = input.blackPlayer;
  if (input.pgn !== undefined) updates.pgn = input.pgn;
  if (input.result !== undefined) updates.result = input.result;
  if (input.playedAt !== undefined) updates.played_at = input.playedAt;
  if (input.url !== undefined) updates.url = input.url;
  if (input.event !== undefined) updates.event = input.event;
  if (input.opening !== undefined) updates.opening = input.opening;
  if (input.description !== undefined) updates.description = input.description;

  const { data, error } = await supabase
    .from("games")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("game.repository.update error:", error);
    return null;
  }

  return toGame(data);
}

export async function remove(
  supabase: SupabaseClient,
  id: string
): Promise<boolean> {
  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error) {
    console.error("game.repository.remove error:", error);
    return false;
  }

  return true;
}
