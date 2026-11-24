/**
 * User Sequence Attempt Service
 *
 * Responsibility: Business logic for user_sequence_attempts.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { toSequenceAttemptStatsFromAttempt } from "@/features/user-sequence-attempt/mapper/user-sequence-attempt.mapper";
import * as userSequenceAttemptRepo from "@/features/user-sequence-attempt/repository/user-sequence-attempt.repository";
import type {
  SaveSequenceAttemptInput,
  SavedSequenceAttempt,
  SequenceAttemptStats,
  SequenceAttemptWriteResult,
  UserSequenceAttempt,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import { createAdminClient } from "@/lib/supabase/admin";

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

export type LatestFinishedAttempt = {
  sequenceId: string;
  startedAt: string;
  stats: SequenceAttemptStats;
};

// ================================================================================================
// Latest completed/failed attempt per sequence for a user (puzzles history source).
// ================================================================================================
export async function getLatestFinishedAttemptsByUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<LatestFinishedAttempt[]> {
  const attempts = await userSequenceAttemptRepo.findFinishedAttemptsByUserId(supabase, userId);
  const seenSequenceIds = new Set<string>();
  const latestBySequence: LatestFinishedAttempt[] = [];

  for (const attempt of attempts) {
    if (seenSequenceIds.has(attempt.sequenceId)) continue;
    seenSequenceIds.add(attempt.sequenceId);
    latestBySequence.push({
      sequenceId: attempt.sequenceId,
      startedAt: attempt.startedAt,
      stats: toSequenceAttemptStatsFromAttempt(attempt),
    });
  }

  return latestBySequence;
}

export async function getRecentCompletedSequenceIds(
  supabase: SupabaseClient,
  userId: string,
  limit: number,
): Promise<string[]> {
  return userSequenceAttemptRepo.findRecentCompletedSequenceIds(supabase, userId, limit);
}

// ================================================================================================
// Sequence ids the user has solved at least once (any completed attempt).
// ================================================================================================
export async function getCompletedSequenceIdsByUser(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const attempts = await userSequenceAttemptRepo.findFinishedAttemptsByUserId(supabase, userId);
  return new Set(attempts.filter((attempt) => attempt.status === "completed").map((attempt) => attempt.sequenceId));
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

// ================================================================================================
// Writes: only the server writes attempts, through the service role. `userId` must be the verified session's.
// ================================================================================================
export async function startAttempt(
  userId: string,
  sequenceId: string,
): Promise<SequenceAttemptWriteResult<UserSequenceAttempt>> {
  return userSequenceAttemptRepo.start(createAdminClient(), userId, sequenceId);
}

// "started" records progress; "completed" / "failed" / "abandoned" finish the attempt for good. A puzzle attempt
// changes the rating in the same transaction: -5 on the first recorded mistake or a failure, +5 on a clean solve,
// once per attempt and once per puzzle.
export async function saveAttempt(
  userId: string,
  input: SaveSequenceAttemptInput,
): Promise<SequenceAttemptWriteResult<SavedSequenceAttempt>> {
  return userSequenceAttemptRepo.save(createAdminClient(), userId, input);
}
