/**
 * User Sequence Attempt Event Service
 *
 * Responsibility: Business logic for user_sequence_attempt_events.
 */
import * as eventRepo from "@/features/user-sequence-attempt-event/repository/user-sequence-attempt-event.repository";
import type {
  CreateUserSequenceAttemptEventInput,
  UserSequenceAttemptEvent,
} from "@/features/user-sequence-attempt-event/types/user-sequence-attempt-event";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getEventById(
  supabase: SupabaseClient,
  id: string,
): Promise<UserSequenceAttemptEvent | null> {
  return eventRepo.findById(supabase, id);
}

export async function getEventsForAttempt(
  supabase: SupabaseClient,
  attemptId: string,
): Promise<UserSequenceAttemptEvent[]> {
  return eventRepo.findByAttemptId(supabase, attemptId);
}

export async function recordEvent(
  supabase: SupabaseClient,
  input: CreateUserSequenceAttemptEventInput,
): Promise<UserSequenceAttemptEvent | null> {
  return eventRepo.create(supabase, input);
}

export async function recordEvents(
  supabase: SupabaseClient,
  inputs: CreateUserSequenceAttemptEventInput[],
): Promise<UserSequenceAttemptEvent[]> {
  return eventRepo.createMany(supabase, inputs);
}

export async function recordMovePlayed(
  supabase: SupabaseClient,
  attemptId: string,
  options: {
    moveUci: string;
    expectedUci: string;
    isCorrect: boolean;
    timeFromStartMs?: number | null;
  },
): Promise<UserSequenceAttemptEvent | null> {
  return eventRepo.create(supabase, {
    attemptId,
    eventType: "move",
    moveUci: options.moveUci,
    expectedUci: options.expectedUci,
    isCorrect: options.isCorrect,
    timeFromStartMs: options.timeFromStartMs,
  });
}

export async function recordHintUsed(
  supabase: SupabaseClient,
  attemptId: string,
  options: {
    hintLevel: 1 | 2;
    timeFromStartMs?: number | null;
  },
): Promise<UserSequenceAttemptEvent | null> {
  return eventRepo.create(supabase, {
    attemptId,
    eventType: "hint",
    hintLevel: options.hintLevel,
    timeFromStartMs: options.timeFromStartMs,
  });
}

export async function deleteEventsForAttempt(
  supabase: SupabaseClient,
  attemptId: string,
): Promise<boolean> {
  return eventRepo.removeByAttemptId(supabase, attemptId);
}
