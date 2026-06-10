/**
 * User Sequence Attempt Event Service
 *
 * Responsibility: Business logic for user_sequence_attempt_events.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as eventRepo from "@/features/user-sequence-attempt-event/repository/user-sequence-attempt-event.repository";
import type {
  CreateUserSequenceAttemptEventInput,
  UserSequenceAttemptEvent,
} from "@/features/user-sequence-attempt-event/types/user-sequence-attempt-event";

export async function recordEvent(
  supabase: SupabaseClient,
  input: CreateUserSequenceAttemptEventInput,
): Promise<UserSequenceAttemptEvent | null> {
  return eventRepo.create(supabase, input);
}
