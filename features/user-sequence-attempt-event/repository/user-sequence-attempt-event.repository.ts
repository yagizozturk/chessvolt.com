/**
 * User Sequence Attempt Event Repository
 *
 * Responsibility: CRUD access to user_sequence_attempt_events.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { toUserSequenceAttemptEvent } from "@/features/user-sequence-attempt-event/mapper/user-sequence-attempt-event.mapper";
import type {
  CreateUserSequenceAttemptEventInput,
  UserSequenceAttemptEvent,
} from "@/features/user-sequence-attempt-event/types/user-sequence-attempt-event";

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
