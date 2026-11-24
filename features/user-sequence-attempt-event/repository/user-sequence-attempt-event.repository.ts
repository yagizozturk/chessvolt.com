/**
 * User Sequence Attempt Event Repository
 *
 * Responsibility: CRUD access to user_sequence_attempt_events.
 *
 * Clients cannot write the table; record() calls a SECURITY DEFINER function that only the service role may execute
 * and that checks the attempt belongs to the user. Pass the admin client and the verified session's user id.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbUserSequenceAttemptEvent,
  toUserSequenceAttemptEvent,
} from "@/features/user-sequence-attempt-event/mapper/user-sequence-attempt-event.mapper";
import type {
  CreateUserSequenceAttemptEventInput,
  RecordAttemptEventResult,
} from "@/features/user-sequence-attempt-event/types/user-sequence-attempt-event";

export async function record(
  admin: SupabaseClient,
  userId: string,
  input: CreateUserSequenceAttemptEventInput,
): Promise<RecordAttemptEventResult> {
  const { data, error } = await admin.rpc("record_sequence_attempt_event", {
    p_user_id: userId,
    p_attempt_id: input.attemptId,
    p_event_type: input.eventType,
    p_move_uci: input.moveUci ?? null,
    p_expected_uci: input.expectedUci ?? null,
    p_is_correct: input.isCorrect ?? null,
    p_hint_level: input.hintLevel ?? null,
    p_time_from_start_ms: input.timeFromStartMs ?? null,
  });

  if (error) {
    if (error.message === "attempt_not_found" || error.message === "invalid_attempt_event") {
      return { ok: false, code: error.message };
    }
    console.error("user-sequence-attempt-event.repository.record error:", error);
    return { ok: false, code: "failed" };
  }

  return { ok: true, event: toUserSequenceAttemptEvent(data as DbUserSequenceAttemptEvent) };
}
