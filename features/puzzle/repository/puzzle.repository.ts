/**
 * Puzzle Repository
 *
 * Responsibility: CRUD access to the puzzles table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { DEFAULT_INITIAL_FEN } from "@/features/move-sequence/mapper/move-sequence.mapper";
import * as moveSequenceService from "@/features/move-sequence/services/move-sequence.service";
import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import { toPuzzle } from "@/features/puzzle/mapper/puzzle.mapper";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import type { PuzzleRatingRange } from "@/features/puzzle/types/puzzle-rating";
import { normalizeUuid, normalizeUuidList } from "@/features/puzzle/utilities/normalize-uuid";

export type RandomActivePuzzleFilter = {
  excludePuzzleId?: string;
  excludeSequenceIds?: string[];
  /** When set, only puzzles rated inside the range (unrated puzzles are skipped). */
  ratingRange?: PuzzleRatingRange;
};

export type RandomPuzzleCandidate = {
  id: string;
  moveSequenceId: string;
};

// Picks up to `limit` active puzzles after a random, indexed UUID pivot (wrapping around to the start).
// Avoids loading every puzzle row.
export async function findRandomActiveCandidates(
  supabase: SupabaseClient,
  filter: RandomActivePuzzleFilter = {},
  limit = 1,
): Promise<RandomPuzzleCandidate[]> {
  const excludePuzzleId = normalizeUuid(filter.excludePuzzleId);
  const excludeSequenceIds = normalizeUuidList(filter.excludeSequenceIds);
  const pivot = crypto.randomUUID();

  const selectActive = () => {
    let query = supabase.from("puzzles").select("id, move_sequence_id").eq("is_active", true);
    if (excludePuzzleId) query = query.neq("id", excludePuzzleId);
    if (excludeSequenceIds.length > 0) {
      query = query.not("move_sequence_id", "in", `(${excludeSequenceIds.join(",")})`);
    }
    if (filter.ratingRange) {
      query = query.gte("rating", filter.ratingRange.min).lte("rating", filter.ratingRange.max);
    }
    return query;
  };

  const { data, error } = await selectActive().gt("id", pivot).order("id", { ascending: true }).limit(limit);
  if (error) {
    console.error("puzzle.repository.findRandomActiveCandidates error:", error);
    return [];
  }

  const rows = [...(data ?? [])];
  if (rows.length < limit) {
    const wrapped = await selectActive()
      .lte("id", pivot)
      .order("id", { ascending: true })
      .limit(limit - rows.length);
    if (wrapped.error) {
      console.error("puzzle.repository.findRandomActiveCandidates error:", wrapped.error);
    } else {
      rows.push(...(wrapped.data ?? []));
    }
  }

  return rows.flatMap((row) =>
    typeof row.id === "string" && typeof row.move_sequence_id === "string"
      ? [{ id: row.id, moveSequenceId: row.move_sequence_id }]
      : [],
  );
}

export async function findById(supabase: SupabaseClient, id: string): Promise<Puzzle | null> {
  const { data, error } = await supabase.from("puzzles").select("*, move_sequences (*)").eq("id", id).maybeSingle();

  if (error) {
    console.error("puzzle.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toPuzzle(data);
}

// ================================================================================================
// Bulk lookup puzzles by move_sequence_id.
// Used by Grand Volt to resolve attempt sequence IDs to scoring metadata (moves, rating).
// ================================================================================================
export async function findByMoveSequenceIds(supabase: SupabaseClient, moveSequenceIds: string[]): Promise<Puzzle[]> {
  if (moveSequenceIds.length === 0) return [];

  const { data, error } = await supabase
    .from("puzzles")
    .select("*, move_sequences (*)")
    .in("move_sequence_id", moveSequenceIds);

  if (error) {
    console.error("puzzle.repository.findByMoveSequenceIds error:", error);
    return [];
  }

  return (data ?? []).map(toPuzzle);
}

export type CreatePuzzleInput = {
  gameId?: string | null;
  sourceId?: string | null;
  source?: string | null;
  title: string;
  rating?: number | null;
  popularity?: number | null;
  pgn?: string | null;
  moves?: string | null;
  initialFen?: string | null;
  displayFen?: string | null;
  goals?: MoveGoals | null;
  isActive?: boolean;
};

export async function create(supabase: SupabaseClient, input: CreatePuzzleInput): Promise<Puzzle | null> {
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
    .from("puzzles")
    .insert({
      game_id: input.gameId ?? null,
      source_id: input.sourceId?.trim() || null,
      source: input.source?.trim() || null,
      title: input.title,
      rating: input.rating !== undefined ? input.rating : null,
      popularity: input.popularity ?? null,
      move_sequence_id: moveSequence.id,
      is_active: input.isActive ?? true,
    })
    .select("*, move_sequences (*)")
    .single();

  if (error) {
    console.error("puzzle.repository.create error:", error);
    return null;
  }

  return toPuzzle(data);
}

export type UpdatePuzzleInput = {
  gameId?: string | null;
  sourceId?: string | null;
  source?: string | null;
  pgn?: string | null;
  initialFen?: string | null;
  title?: string;
  rating?: number | null;
  popularity?: number | null;
  moves?: string | null;
  displayFen?: string | null;
  goals?: MoveGoals | null;
  isActive?: boolean;
};

export async function update(supabase: SupabaseClient, id: string, input: UpdatePuzzleInput): Promise<Puzzle | null> {
  const existing = await findById(supabase, id);
  if (!existing) return null;

  const hasSequenceUpdate =
    input.moves !== undefined ||
    input.displayFen !== undefined ||
    input.initialFen !== undefined ||
    input.pgn !== undefined ||
    input.goals !== undefined;

  if (hasSequenceUpdate) {
    const displayFen = input.displayFen !== undefined ? input.displayFen : existing.moveSequence.displayFen;
    const initialFen =
      input.initialFen !== undefined ? input.initialFen : input.displayFen !== undefined ? input.displayFen : undefined;
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
  if (input.sourceId !== undefined) updates.source_id = input.sourceId?.trim() || null;
  if (input.source !== undefined) updates.source = input.source?.trim() || null;
  if (input.title !== undefined) updates.title = input.title;
  if (input.rating !== undefined) updates.rating = input.rating;
  if (input.popularity !== undefined) updates.popularity = input.popularity;
  if (input.isActive !== undefined) updates.is_active = input.isActive;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("puzzles").update(updates).eq("id", id);
    if (error) {
      console.error("puzzle.repository.update error:", error);
      return null;
    }
  }

  return findById(supabase, id);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("puzzles").delete().eq("id", id);

  if (error) {
    console.error("puzzle.repository.remove error:", error);
    return false;
  }

  return true;
}

export async function findExistingSourceIds(
  supabase: SupabaseClient,
  source: string,
  sourceIds: string[],
): Promise<Set<string>> {
  const unique = [...new Set(sourceIds.map((id) => id.trim()).filter(Boolean))];
  if (unique.length === 0) return new Set();

  const { data, error } = await supabase
    .from("puzzles")
    .select("source_id")
    .eq("source", source)
    .in("source_id", unique);

  if (error) {
    console.error("puzzle.repository.findExistingSourceIds error:", error);
    return new Set();
  }

  return new Set(
    (data ?? []).map((row) => row.source_id).filter((id): id is string => typeof id === "string" && id.length > 0),
  );
}
