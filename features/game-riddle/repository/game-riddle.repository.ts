/**
 * Game Riddle Repository
 *
 * Responsibility: CRUD access to the game_riddles table.
 */

import * as moveSequenceService from "@/features/move-sequence/services/move-sequence.service";
import { toGameRiddle } from "@/features/game-riddle/mapper/game-riddle.mapper";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import { DEFAULT_INITIAL_FEN } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function findAll(supabase: SupabaseClient): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*, move_sequences (*)")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findAll error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export async function findById(supabase: SupabaseClient, id: string): Promise<GameRiddle | null> {
  const { data, error } = await supabase
    .from("game_riddles")
    .select("*, move_sequences (*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("game-riddle.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toGameRiddle(data);
}

export async function findByGameId(supabase: SupabaseClient, gameId: string): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*, move_sequences (*)")
    .eq("game_id", gameId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("game-riddle.repository.findByGameId error:", error);
    return [];
  }

  return (riddles ?? []).map(toGameRiddle);
}

export async function findByGameType(supabase: SupabaseClient, gameType: string): Promise<GameRiddle[]> {
  const { data: riddles, error } = await supabase
    .from("game_riddles")
    .select("*, move_sequences (*)")
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
  const displayFen = input.displayFen ?? null;
  const moves = input.moves?.trim() || "e2e4";

  const moveSequence = await moveSequenceService.createMoveSequence(supabase, {
    initialFen: displayFen ?? DEFAULT_INITIAL_FEN,
    moves,
    displayFen,
  });
  if (!moveSequence) return null;

  const { data, error } = await supabase
    .from("game_riddles")
    .insert({
      game_id: input.gameId,
      title: input.title,
      game_type: input.gameType ?? null,
      move_sequence_id: moveSequence.id,
    })
    .select("*, move_sequences (*)")
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
  const existing = await findById(supabase, id);
  if (!existing) return null;

  const hasSequenceUpdate =
    input.moves !== undefined || input.displayFen !== undefined;

  if (hasSequenceUpdate) {
    const displayFen =
      input.displayFen !== undefined ? input.displayFen : existing.moveSequence.displayFen;
    const updated = await moveSequenceService.updateMoveSequence(supabase, existing.moveSequence.id, {
      moves: input.moves ?? undefined,
      displayFen: input.displayFen,
      initialFen: displayFen ?? undefined,
    });
    if (!updated) return null;
  }

  const updates: Record<string, unknown> = {};
  if (input.gameId !== undefined) updates.game_id = input.gameId;
  if (input.title !== undefined) updates.title = input.title;
  if (input.gameType !== undefined) updates.game_type = input.gameType;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("game_riddles").update(updates).eq("id", id);
    if (error) {
      console.error("game-riddle.repository.update error:", error);
      return null;
    }
  }

  return findById(supabase, id);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("game_riddles").delete().eq("id", id);

  if (error) {
    console.error("game-riddle.repository.remove error:", error);
    return false;
  }

  return true;
}
