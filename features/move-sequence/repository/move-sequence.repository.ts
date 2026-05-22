import { toMoveSequence } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type {
  CreateMoveSequenceInput,
  MoveSequence,
  UpdateMoveSequenceInput,
} from "@/features/move-sequence/types/move-sequence";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_INITIAL_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
