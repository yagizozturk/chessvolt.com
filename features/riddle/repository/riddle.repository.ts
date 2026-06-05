/**
 * Riddle Repository
 *
 * Responsibility: CRUD access to the riddles table.
 */

import * as moveSequenceService from "@/features/move-sequence/services/move-sequence.service";
import { toRiddle, type DbRiddle } from "@/features/riddle/mapper/riddle.mapper";
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

type DbRiddleCollectionJoinRow = {
  sort_order: number;
  created_at: string;
  riddles: DbRiddle | DbRiddle[] | null;
};

export async function findByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
  options?: { activeOnly?: boolean },
): Promise<Riddle[]> {
  const { data, error } = await supabase
    .from("riddle_collections")
    .select("sort_order, created_at, riddles (*, move_sequences (*))")
    .eq("collection_id", collectionId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("riddle.repository.findByCollectionId error:", error);
    return [];
  }

  return (data ?? [])
    .map((row) => {
      const joinRow = row as DbRiddleCollectionJoinRow;
      const riddleRow = Array.isArray(joinRow.riddles) ? joinRow.riddles[0] : joinRow.riddles;
      if (!riddleRow) return null;
      if (options?.activeOnly && !riddleRow.is_active) return null;
      return toRiddle(riddleRow);
    })
    .filter((riddle): riddle is Riddle => riddle != null);
}

export type FindActiveRiddlesByThemesInput = {
  themeSlugs: string[];
  limit?: number;
};

export async function findActiveByThemes(
  supabase: SupabaseClient,
  input: FindActiveRiddlesByThemesInput,
): Promise<Riddle[]> {
  if (input.themeSlugs.length === 0) return [];

  const { data, error } = await supabase
    .from("riddles")
    .select(RIDDLE_SELECT)
    .eq("is_active", true)
    .overlaps("themes", input.themeSlugs)
    .order("created_at", { ascending: true })
    .limit(input.limit ?? 100);

  if (error) {
    console.error("riddle.repository.findActiveByThemes error:", error);
    return [];
  }

  return (data ?? []).map(toRiddle);
}

export type FindActiveRiddlesByThemesAndRatingRangeInput = {
  themeSlugs: string[];
  minRating: number;
  maxRating: number;
  limit?: number;
};

export async function findActiveByThemesAndRatingRange(
  supabase: SupabaseClient,
  input: FindActiveRiddlesByThemesAndRatingRangeInput,
): Promise<Riddle[]> {
  if (input.themeSlugs.length === 0) return [];

  const { data, error } = await supabase
    .from("riddles")
    .select(RIDDLE_SELECT)
    .eq("is_active", true)
    .overlaps("themes", input.themeSlugs)
    .not("rating", "is", null)
    .gte("rating", input.minRating)
    .lte("rating", input.maxRating)
    .order("rating", { ascending: true })
    .limit(input.limit ?? 100);

  if (error) {
    console.error("riddle.repository.findActiveByThemesAndRatingRange error:", error);
    return [];
  }

  return (data ?? []).map(toRiddle);
}

export type FindActiveRiddlesByRatingRangeInput = {
  minRating: number;
  maxRating: number;
  limit?: number;
};

export async function findActiveByRatingRange(
  supabase: SupabaseClient,
  input: FindActiveRiddlesByRatingRangeInput,
): Promise<Riddle[]> {
  const { data, error } = await supabase
    .from("riddles")
    .select(RIDDLE_SELECT)
    .eq("is_active", true)
    .not("rating", "is", null)
    .gte("rating", input.minRating)
    .lte("rating", input.maxRating)
    .order("rating", { ascending: true })
    .limit(input.limit ?? 100);

  if (error) {
    console.error("riddle.repository.findActiveByRatingRange error:", error);
    return [];
  }

  return (data ?? []).map(toRiddle);
}

export type CreateRiddleInput = {
  gameId?: string | null;
  title: string;
  description?: string | null;
  rating?: number | null;
  pgn?: string | null;
  moves?: string | null;
  initialFen?: string | null;
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
  const initialFen = input.initialFen ?? displayFen ?? DEFAULT_INITIAL_FEN;
  const moves = input.moves?.trim() || "e2e4";

  const moveSequence = await moveSequenceService.createMoveSequence(supabase, {
    initialFen,
    moves,
    pgn: input.pgn ?? null,
    displayFen,
    goals: input.goals,
  });
  if (!moveSequence) return null;

  const { data, error } = await supabase
    .from("riddles")
    .insert({
      game_id: input.gameId ?? null,
      title: input.title,
      description: input.description?.trim() || null,
      rating: input.rating ?? null,
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
  gameId?: string | null;
  pgn?: string | null;
  initialFen?: string | null;
  title?: string;
  description?: string | null;
  rating?: number | null;
  moves?: string | null;
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
    input.initialFen !== undefined ||
    input.pgn !== undefined ||
    input.goals !== undefined;

  if (hasSequenceUpdate) {
    const displayFen =
      input.displayFen !== undefined ? input.displayFen : existing.moveSequence.displayFen;
    const initialFen =
      input.initialFen !== undefined
        ? input.initialFen
        : input.displayFen !== undefined
          ? input.displayFen
          : undefined;
    const updated = await moveSequenceService.updateMoveSequence(supabase, existing.moveSequence.id, {
      moves: input.moves ?? undefined,
      pgn: input.pgn,
      displayFen: input.displayFen,
      initialFen: initialFen ?? displayFen ?? undefined,
      goals: input.goals,
    });
    if (!updated) return null;
  }

  const updates: Record<string, unknown> = {};
  if (input.gameId !== undefined) updates.game_id = input.gameId || null;
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description?.trim() || null;
  if (input.rating !== undefined) updates.rating = input.rating;
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
