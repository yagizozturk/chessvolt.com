/**
 * User Sequence Attempt Event Repository
 *
 * Responsibility: CRUD access to user_sequence_attempt_events.
 */
import { toUserSequenceAttemptEvent } from "@/features/user-sequence-attempt-event/mapper/user-sequence-attempt-event.mapper";
import type {
  CreateUserSequenceAttemptEventInput,
  UserSequenceAttemptEvent,
} from "@/features/user-sequence-attempt-event/types/user-sequence-attempt-event";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<UserSequenceAttemptEvent | null> {
  const { data, error } = await supabase
    .from("user_sequence_attempt_events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("user-sequence-attempt-event.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toUserSequenceAttemptEvent(data);
}

export async function findByAttemptId(
  supabase: SupabaseClient,
  attemptId: string,
): Promise<UserSequenceAttemptEvent[]> {
  const { data, error } = await supabase
    .from("user_sequence_attempt_events")
    .select("*")
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-sequence-attempt-event.repository.findByAttemptId error:", error);
    return [];
  }

  return (data ?? []).map(toUserSequenceAttemptEvent);
}

export async function create(
  supabase: SupabaseClient,
  input: CreateUserSequenceAttemptEventInput,
): Promise<UserSequenceAttemptEvent | null> {
  const { data, error } = await supabase
    .from("user_sequence_attempt_events")
    .insert({
      attempt_id: input.attemptId,
      event_type: input.eventType,
      move_uci: input.moveUci ?? null,
      expected_uci: input.expectedUci ?? null,
      is_correct: input.isCorrect ?? null,
      hint_level: input.hintLevel ?? null,
      time_from_start_ms: input.timeFromStartMs ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("user-sequence-attempt-event.repository.create error:", error);
    return null;
  }

  return toUserSequenceAttemptEvent(data);
}

export async function createMany(
  supabase: SupabaseClient,
  inputs: CreateUserSequenceAttemptEventInput[],
): Promise<UserSequenceAttemptEvent[]> {
  if (inputs.length === 0) return [];

  const rows = inputs.map((input) => ({
    attempt_id: input.attemptId,
    event_type: input.eventType,
    move_uci: input.moveUci ?? null,
    expected_uci: input.expectedUci ?? null,
    is_correct: input.isCorrect ?? null,
    hint_level: input.hintLevel ?? null,
    time_from_start_ms: input.timeFromStartMs ?? null,
  }));

  const { data, error } = await supabase
    .from("user_sequence_attempt_events")
    .insert(rows)
    .select();

  if (error) {
    console.error("user-sequence-attempt-event.repository.createMany error:", error);
    return [];
  }

  return (data ?? []).map(toUserSequenceAttemptEvent);
}

export async function removeByAttemptId(
  supabase: SupabaseClient,
  attemptId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("user_sequence_attempt_events")
    .delete()
    .eq("attempt_id", attemptId);

  if (error) {
    console.error("user-sequence-attempt-event.repository.removeByAttemptId error:", error);
    return false;
  }

  return true;
}
