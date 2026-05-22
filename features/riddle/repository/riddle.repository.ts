/**
 * Riddle Repository
 *
 * Responsibility: CRUD access to the riddles table.
 */

import * as moveSequenceService from "@/features/move-sequence/services/move-sequence.service";
import { toRiddle } from "@/features/riddle/mapper/riddle.mapper";
import type { Riddle } from "@/features/riddle/types/riddle";
import { DEFAULT_INITIAL_FEN } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { SupabaseClient } from "@supabase/supabase-js";

const RIDDLE_SELECT = "*, move_sequences (*)";

export async function findAll(supabase: SupabaseClient): Promise<Riddle[]> {
  const { data: riddles, error } = await supabase
    .from("riddles")
    .select(RIDDLE_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("riddle.repository.findAll error:", error);
    return [];
  }

  return (riddles ?? []).map(toRiddle);
}

export async function findAllActive(supabase: SupabaseClient): Promise<Riddle[]> {
  const { data: riddles, error } = await supabase
    .from("riddles")
    .select(RIDDLE_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("riddle.repository.findAllActive error:", error);
    return [];
  }

  return (riddles ?? []).map(toRiddle);
}

export async function findById(supabase: SupabaseClient, id: string): Promise<Riddle | null> {
  const { data, error } = await supabase
    .from("riddles")
    .select(RIDDLE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("riddle.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toRiddle(data);
}

export async function findByGameId(supabase: SupabaseClient, gameId: string): Promise<Riddle[]> {
  const { data: riddles, error } = await supabase
    .from("riddles")
    .select(RIDDLE_SELECT)
    .eq("game_id", gameId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("riddle.repository.findByGameId error:", error);
    return [];
  }

  return (riddles ?? []).map(toRiddle);
}

export async function findByGameType(
  supabase: SupabaseClient,
  gameType: string,
  options?: { activeOnly?: boolean },
): Promise<Riddle[]> {
  let query = supabase.from("riddles").select(RIDDLE_SELECT).eq("game_type", gameType);

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data: riddles, error } = await query.order("created_at", { ascending: true });

  if (error) {
    console.error("riddle.repository.findByGameType error:", error);
    return [];
  }

  return (riddles ?? []).map(toRiddle);
}

export type CreateRiddleInput = {
  gameId: string;
  title: string;
  moves?: string | null;
  gameType?: string | null;
  displayFen?: string | null;
  goals?: MoveGoal[] | null;
  themes?: string[];
  isActive?: boolean;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateRiddleInput,
): Promise<Riddle | null> {
  const displayFen = input.displayFen ?? null;
  const moves = input.moves?.trim() || "e2e4";

  const moveSequence = await moveSequenceService.createMoveSequence(supabase, {
    initialFen: displayFen ?? DEFAULT_INITIAL_FEN,
    moves,
    displayFen,
    goals: input.goals,
  });
  if (!moveSequence) return null;

  const { data, error } = await supabase
    .from("riddles")
    .insert({
      game_id: input.gameId,
      title: input.title,
      game_type: input.gameType ?? null,
      move_sequence_id: moveSequence.id,
      themes: input.themes ?? [],
      is_active: input.isActive ?? true,
    })
    .select(RIDDLE_SELECT)
    .single();

  if (error) {
    console.error("riddle.repository.create error:", error);
    return null;
  }

  return toRiddle(data);
}

export type UpdateRiddleInput = {
  gameId?: string;
  title?: string;
  moves?: string | null;
  gameType?: string | null;
  displayFen?: string | null;
  goals?: MoveGoal[] | null;
  themes?: string[];
  isActive?: boolean;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateRiddleInput,
): Promise<Riddle | null> {
  const existing = await findById(supabase, id);
  if (!existing) return null;

  const hasSequenceUpdate =
    input.moves !== undefined ||
    input.displayFen !== undefined ||
    input.goals !== undefined;

  if (hasSequenceUpdate) {
    const displayFen =
      input.displayFen !== undefined ? input.displayFen : existing.moveSequence.displayFen;
    const updated = await moveSequenceService.updateMoveSequence(supabase, existing.moveSequence.id, {
      moves: input.moves ?? undefined,
      displayFen: input.displayFen,
      initialFen: displayFen ?? undefined,
      goals: input.goals,
    });
    if (!updated) return null;
  }

  const updates: Record<string, unknown> = {};
  if (input.gameId !== undefined) updates.game_id = input.gameId;
  if (input.title !== undefined) updates.title = input.title;
  if (input.gameType !== undefined) updates.game_type = input.gameType;
  if (input.themes !== undefined) updates.themes = input.themes;
  if (input.isActive !== undefined) updates.is_active = input.isActive;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("riddles").update(updates).eq("id", id);
    if (error) {
      console.error("riddle.repository.update error:", error);
      return null;
    }
  }

  return findById(supabase, id);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("riddles").delete().eq("id", id);

  if (error) {
    console.error("riddle.repository.remove error:", error);
    return false;
  }

  return true;
}
