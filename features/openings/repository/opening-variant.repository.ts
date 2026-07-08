// TODO: Refactor
/**
 * Opening Variant Repository
 *
 * Responsibility: CRUD access to the opening_variants table.
 */
import * as moveSequenceService from "@/features/move-sequence/services/move-sequence.service";
import {
  toMoveSequenceForGoalsBackfill,
  type DbMoveSequenceForGoalsBackfill,
} from "@/features/move-sequence/mapper/move-sequence.mapper";
import { toOpeningVariant } from "@/features/openings/mapper/opening-variant.mapper";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { OpeningVariantForGoalsBackfill } from "@/features/openings/types/opening-variant-for-goals-backfill";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { SupabaseClient } from "@supabase/supabase-js";

type DbOpeningVariantForGoalsBackfill = {
  id: string;
  initial_ply: number;
  move_sequences: DbMoveSequenceForGoalsBackfill | DbMoveSequenceForGoalsBackfill[] | null;
};

function getEmbeddedGoalsBackfillSequence(
  moveSequences: DbMoveSequenceForGoalsBackfill | DbMoveSequenceForGoalsBackfill[] | null,
): DbMoveSequenceForGoalsBackfill | null {
  if (!moveSequences) return null;
  return Array.isArray(moveSequences) ? (moveSequences[0] ?? null) : moveSequences;
}

function toOpeningVariantForGoalsBackfill(
  db: DbOpeningVariantForGoalsBackfill,
): OpeningVariantForGoalsBackfill | null {
  const seqRow = getEmbeddedGoalsBackfillSequence(db.move_sequences);
  if (!seqRow) return null;

  return {
    variantId: db.id,
    initialPly: db.initial_ply ?? 0,
    moveSequence: toMoveSequenceForGoalsBackfill(seqRow),
  };
}

export async function findById(supabase: SupabaseClient, id: string): Promise<OpeningVariant | null> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("*, move_sequences (*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("opening-variant.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toOpeningVariant(data);
}

export async function getVariantCountsByOpeningIds(
  supabase: SupabaseClient,
  openingIds: string[],
): Promise<Record<string, number>> {
  if (openingIds.length === 0) return {};
  const { data, error } = await supabase.from("opening_variants").select("opening_id").in("opening_id", openingIds);

  if (error) {
    console.error("opening-variant.repository.getVariantCountsByOpeningIds error:", error);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const id of openingIds) counts[id] = 0;
  for (const row of data ?? []) {
    const oid = (row as { opening_id: string }).opening_id;
    if (oid) counts[oid] = (counts[oid] ?? 0) + 1;
  }
  return counts;
}

export async function findByOpeningId(supabase: SupabaseClient, openingId: string): Promise<OpeningVariant[]> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("*, move_sequences (*)")
    .eq("opening_id", openingId)
    .order("sort_key", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("opening-variant.repository.findByOpeningId error:", error);
    return [];
  }

  return (data ?? []).map(toOpeningVariant);
}

export async function getMaxSortKeyByOpeningId(supabase: SupabaseClient, openingId: string): Promise<number> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("sort_key")
    .eq("opening_id", openingId)
    .order("sort_key", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("opening-variant.repository.getMaxSortKeyByOpeningId error:", error);
    return 0;
  }

  return typeof data?.sort_key === "number" ? data.sort_key : 0;
}

// ================================================================================================
// Bulk lookup opening variants by move_sequence_id.
// Used by Grand Volt to resolve attempt sequence IDs to scoring metadata (moves, rating).
// ================================================================================================
export async function findByMoveSequenceIds(
  supabase: SupabaseClient,
  moveSequenceIds: string[],
): Promise<OpeningVariant[]> {
  if (moveSequenceIds.length === 0) return [];

  const { data, error } = await supabase
    .from("opening_variants")
    .select("*, move_sequences (*)")
    .in("move_sequence_id", moveSequenceIds);

  if (error) {
    console.error("opening-variant.repository.findByMoveSequenceIds error:", error);
    return [];
  }

  return (data ?? []).map(toOpeningVariant);
}

export async function findWithNullGoals(
  supabase: SupabaseClient,
  { limit }: { limit: number },
): Promise<OpeningVariantForGoalsBackfill[]> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("id, initial_ply, move_sequences!inner(id, initial_fen, moves, pgn)")
    .is("move_sequences.goals", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("opening-variant.repository.findWithNullGoals error:", error);
    return [];
  }

  return (data ?? [])
    .map((row) => toOpeningVariantForGoalsBackfill(row as DbOpeningVariantForGoalsBackfill))
    .filter((row): row is OpeningVariantForGoalsBackfill => row !== null);
}

export async function findByIdWithNullGoals(
  supabase: SupabaseClient,
  variantId: string,
): Promise<OpeningVariantForGoalsBackfill | null> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("id, initial_ply, move_sequences!inner(id, initial_fen, moves, pgn)")
    .eq("id", variantId)
    .is("move_sequences.goals", null)
    .maybeSingle();

  if (error) {
    console.error("opening-variant.repository.findByIdWithNullGoals error:", error);
    return null;
  }

  return data
    ? toOpeningVariantForGoalsBackfill(data as DbOpeningVariantForGoalsBackfill)
    : null;
}

export type CreateOpeningVariantInput = {
  openingId: string;
  sortKey: number;
  title?: string | null;
  description?: string | null;
  initialPly: number;
  moves: string;
  pgn: string;
  initialFen?: string | null;
  displayFen?: string | null;
  goals?: MoveGoal[] | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  const moveSequence = await moveSequenceService.createMoveSequence(supabase, {
    initialFen: input.initialFen ?? undefined,
    moves: input.moves,
    pgn: input.pgn,
    displayFen: input.displayFen,
    goals: input.goals,
  });
  if (!moveSequence) return null;

  const { data, error } = await supabase
    .from("opening_variants")
    .insert({
      opening_id: input.openingId,
      sort_key: input.sortKey,
      title: input.title ?? null,
      description: input.description ?? null,
      initial_ply: input.initialPly,
      move_sequence_id: moveSequence.id,
    })
    .select("*, move_sequences (*)")
    .single();

  if (error) {
    console.error("opening-variant.repository.create error:", error);
    return null;
  }

  return toOpeningVariant(data);
}

export type UpdateOpeningVariantInput = {
  sortKey?: number;
  title?: string | null;
  description?: string | null;
  initialPly?: number;
  moves?: string;
  pgn?: string;
  initialFen?: string | null;
  displayFen?: string | null;
  goals?: MoveGoal[] | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  const existing = await findById(supabase, id);
  if (!existing) return null;

  const hasSequenceUpdate =
    input.moves !== undefined ||
    input.pgn !== undefined ||
    input.initialFen !== undefined ||
    input.displayFen !== undefined ||
    input.goals !== undefined;

  if (hasSequenceUpdate) {
    const updated = await moveSequenceService.updateMoveSequence(supabase, existing.moveSequence.id, {
      moves: input.moves,
      pgn: input.pgn,
      initialFen: input.initialFen ?? undefined,
      displayFen: input.displayFen,
      goals: input.goals,
    });
    if (!updated) return null;
  }

  const updates: Record<string, unknown> = {};
  if (input.sortKey !== undefined) updates.sort_key = input.sortKey;
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.initialPly !== undefined) updates.initial_ply = input.initialPly;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("opening_variants").update(updates).eq("id", id);
    if (error) {
      console.error("opening-variant.repository.update error:", error);
      return null;
    }
  }

  return findById(supabase, id);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { data, error } = await supabase.from("opening_variants").delete().eq("id", id).select("id");

  if (error) {
    console.error("opening-variant.repository.remove error:", error);
    return false;
  }

  if (!data?.length) {
    console.error("opening-variant.repository.remove: no row deleted (missing or RLS)", { id });
    return false;
  }

  return true;
}
