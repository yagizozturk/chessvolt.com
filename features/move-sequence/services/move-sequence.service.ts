// TODO: Refactor
import * as moveSequenceRepo from "@/features/move-sequence/repository/move-sequence.repository";
import type {
  CreateMoveSequenceInput,
  MoveSequence,
  UpdateMoveSequenceInput,
} from "@/features/move-sequence/types/move-sequence";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createMoveSequence(
  supabase: SupabaseClient,
  input: CreateMoveSequenceInput,
): Promise<MoveSequence | null> {
  return moveSequenceRepo.create(supabase, input);
}

export async function updateMoveSequence(
  supabase: SupabaseClient,
  id: string,
  input: UpdateMoveSequenceInput,
): Promise<MoveSequence | null> {
  return moveSequenceRepo.update(supabase, id, input);
}
