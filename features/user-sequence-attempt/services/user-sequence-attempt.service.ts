/**
 * User Sequence Attempt Service
 *
 * Responsibility: Business logic for user_sequence_attempts.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as userSequenceAttemptRepo from "@/features/user-sequence-attempt/repository/user-sequence-attempt.repository";
import type {
  SequenceAttemptStats,
  UpdateUserSequenceAttemptInput,
  UserSequenceAttempt,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";

export async function getAttemptById(supabase: SupabaseClient, id: string): Promise<UserSequenceAttempt | null> {
  return userSequenceAttemptRepo.findById(supabase, id);
}

export async function getAttemptsByUserAndSequence(
  supabase: SupabaseClient,
  userId: string,
  sequenceId: string,
): Promise<UserSequenceAttempt[]> {
  return userSequenceAttemptRepo.findByUserAndSequenceId(supabase, userId, sequenceId);
}

// ================================================================================================
// Getting attempts by user and sequence ids
// Providing which sequence id user want the attempt data. result is in UserSequenceAttempt[]
// ================================================================================================
export async function getAttemptsByUserAndSequenceIds(
  supabase: SupabaseClient,
  userId: string,
  sequenceIds: string[],
): Promise<UserSequenceAttempt[]> {
  return userSequenceAttemptRepo.findByUserAndSequenceIds(supabase, userId, sequenceIds);
}

// ================================================================================================
// Getting all attempts by user since a timestamp (inclusive).
// Pass getVoltLookbackStart().toISOString() for Grand Volt aggregation.
// ================================================================================================
export async function getAttemptsByUserSince(
  supabase: SupabaseClient,
  userId: string,
  startedAtOrAfter: string,
): Promise<UserSequenceAttempt[]> {
  return userSequenceAttemptRepo.findByUserIdSince(supabase, userId, startedAtOrAfter);
}

// ================================================================================================
// Getting latest attempt stats by user for sequence ids
// ================================================================================================
export async function getLatestAttemptStatsForSequences(
  supabase: SupabaseClient,
  userId: string,
  sequenceIds: string[],
): Promise<SequenceAttemptStats[]> {
  return userSequenceAttemptRepo.findLatestAttemptStatsForSequences(supabase, userId, sequenceIds);
}

export async function startAttempt(
  supabase: SupabaseClient,
  userId: string,
  sequenceId: string,
): Promise<UserSequenceAttempt | null> {
  return userSequenceAttemptRepo.create(supabase, {
    userId,
    sequenceId,
    status: "started",
  });
}

export async function updateAttempt(
  supabase: SupabaseClient,
  id: string,
  input: UpdateUserSequenceAttemptInput,
): Promise<UserSequenceAttempt | null> {
  return userSequenceAttemptRepo.update(supabase, id, input);
}

export async function completeAttempt(
  supabase: SupabaseClient,
  id: string,
  options?: {
    durationMs?: number | null;
    correctMoveCount?: number;
    wrongMoveCount?: number;
    hintCount?: number;
    maxCorrectStreak?: number;
  },
): Promise<UserSequenceAttempt | null> {
  return userSequenceAttemptRepo.update(supabase, id, {
    status: "completed",
    completedAt: new Date().toISOString(),
    durationMs: options?.durationMs,
    correctMoveCount: options?.correctMoveCount,
    wrongMoveCount: options?.wrongMoveCount,
    hintCount: options?.hintCount,
    maxCorrectStreak: options?.maxCorrectStreak,
  });
}
