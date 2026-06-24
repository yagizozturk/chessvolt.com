import {
  DEFAULT_INITIAL_FEN,
  toMoveSequence,
  toMoveSequenceForGoalsBackfill,
} from "@/features/move-sequence/mapper/move-sequence.mapper";
import type {
  CreateMoveSequenceInput,
  MoveSequence,
  UpdateMoveSequenceInput,
} from "@/features/move-sequence/types/move-sequence";
import type { MoveSequenceForGoalsBackfill } from "@/features/move-sequence/types/move-sequence-for-goals-backfill";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function create(
  supabase: SupabaseClient,
  input: CreateMoveSequenceInput,
): Promise<MoveSequence | null> {
  const { data, error } = await supabase
    .from("move_sequences")
    .insert({
      initial_fen: input.initialFen ?? DEFAULT_INITIAL_FEN,
      moves: input.moves,
      pgn: input.pgn ?? null,
      display_fen: input.displayFen ?? null,
      goals: input.goals ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("move-sequence.repository.create error:", error);
    return null;
  }

  return toMoveSequence(data);
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateMoveSequenceInput,
): Promise<MoveSequence | null> {
  const updates: Record<string, unknown> = {};
  if (input.initialFen !== undefined) updates.initial_fen = input.initialFen;
  if (input.moves !== undefined) updates.moves = input.moves;
  if (input.pgn !== undefined) updates.pgn = input.pgn;
  if (input.displayFen !== undefined) updates.display_fen = input.displayFen;
  if (input.goals !== undefined) updates.goals = input.goals;

  const { data, error } = await supabase
    .from("move_sequences")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("move-sequence.repository.update error:", error);
    return null;
  }

  return toMoveSequence(data);
}

export async function findWithNullGoals(
  supabase: SupabaseClient,
  { limit }: { limit: number },
): Promise<MoveSequenceForGoalsBackfill[]> {
  const { data, error } = await supabase
    .from("move_sequences")
    .select("id, initial_fen, moves, pgn")
    .is("goals", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("move-sequence.repository.findWithNullGoals error:", error);
    return [];
  }

  return (data ?? []).map(toMoveSequenceForGoalsBackfill);
}

export async function findByIdWithNullGoals(
  supabase: SupabaseClient,
  id: string,
): Promise<MoveSequenceForGoalsBackfill | null> {
  const { data, error } = await supabase
    .from("move_sequences")
    .select("id, initial_fen, moves, pgn")
    .eq("id", id)
    .is("goals", null)
    .maybeSingle();

  if (error) {
    console.error("move-sequence.repository.findByIdWithNullGoals error:", error);
    return null;
  }

  return data ? toMoveSequenceForGoalsBackfill(data) : null;
}
