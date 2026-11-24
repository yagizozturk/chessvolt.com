/**
 * User Sequence Attempt Event Service
 *
 * Responsibility: Business logic for user_sequence_attempt_events.
 */
import * as eventRepo from "@/features/user-sequence-attempt-event/repository/user-sequence-attempt-event.repository";
import type {
  CreateUserSequenceAttemptEventInput,
  RecordAttemptEventResult,
} from "@/features/user-sequence-attempt-event/types/user-sequence-attempt-event";
import { createAdminClient } from "@/lib/supabase/admin";

// Only the server writes events, through the service role. `userId` must be the verified session's.
export async function recordEvent(
  userId: string,
  input: CreateUserSequenceAttemptEventInput,
): Promise<RecordAttemptEventResult> {
  return eventRepo.record(createAdminClient(), userId, input);
}
