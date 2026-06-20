import type { SupabaseClient } from "@supabase/supabase-js";

import {
  mapDbToSequenceAttemptStats,
  toUserSequenceAttempt,
} from "@/features/user-sequence-attempt/mapper/user-sequence-attempt.mapper";
import type {
  CreateUserSequenceAttemptInput,
  SequenceAttemptStats,
  UpdateUserSequenceAttemptInput,
  UserSequenceAttempt,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";

// ================================================================================================
// Getting attempt by id
// ================================================================================================
export async function findById(supabase: SupabaseClient, id: string): Promise<UserSequenceAttempt | null> {
  const { data, error } = await supabase.from("user_sequence_attempts").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("user-sequence-attempt.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toUserSequenceAttempt(data);
}

export async function findByUserAndSequenceId(
  supabase: SupabaseClient,
  userId: string,
  sequenceId: string,
): Promise<UserSequenceAttempt[]> {
  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("sequence_id", sequenceId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("user-sequence-attempt.repository.findByUserAndSequenceId error:", error);
    return [];
  }

  return (data ?? []).map(toUserSequenceAttempt);
}

// ================================================================================================
// Getting attempts by user and sequence ids
// Providing which sequence id user want the attempt data. result is in UserSequenceAttempt[]
// ================================================================================================
export async function findByUserAndSequenceIds(
  supabase: SupabaseClient,
  userId: string,
  sequenceIds: string[],
): Promise<UserSequenceAttempt[]> {
  if (sequenceIds.length === 0) return [];

  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .in("sequence_id", sequenceIds)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("user-sequence-attempt.repository.findByUserAndSequenceIds error:", error);
    return [];
  }

  return (data ?? []).map(toUserSequenceAttempt);
}

// ================================================================================================
// Getting all attempts by user since a timestamp (inclusive).
// Used by Grand Volt to load every attempt in the lookback window in one query,
// instead of fetching per-sequence like collection pages do.
// ================================================================================================
export async function findByUserIdSince(
  supabase: SupabaseClient,
  userId: string,
  startedAtOrAfter: string,
): Promise<UserSequenceAttempt[]> {
  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .gte("started_at", startedAtOrAfter)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("user-sequence-attempt.repository.findByUserIdSince error:", error);
    return [];
  }

  return (data ?? []).map(toUserSequenceAttempt);
}

// ================================================================================================
// Getting latest attempt summaries by user and sequence ids. Last date one on particular sequenceId
// Collection has multiple riddles. Riddles have multiple solving attempts.
// This function returns the latest attempt summary for each sequenceId in the collection.
// example output:
// [{
//    "sequenceId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
//    "status": "failed",
//    "isCompleted": false,
//    "correctMoveCount": 5,
//    "wrongMoveCount": 3,
//    "hintCount": 2,
//    "maxCorrectStreak": 4,
//    "durationMs": 28100
// }]
// ================================================================================================
export async function findLatestAttemptStatsForSequences(
  supabase: SupabaseClient,
  userId: string,
  sequenceIds: string[],
): Promise<SequenceAttemptStats[]> {
  if (sequenceIds.length === 0) return [];

  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .in("sequence_id", sequenceIds)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("user-sequence-attempt.repository.findLatestAttemptStatsForSequences error:", error);
    return [];
  }

  const sequenceIdSet = new Set<string>();
  const sequenceAttemptStats: SequenceAttemptStats[] = [];

  for (const row of data ?? []) {
    if (sequenceIdSet.has(row.sequence_id)) continue;
    sequenceIdSet.add(row.sequence_id);
    sequenceAttemptStats.push(mapDbToSequenceAttemptStats(row));
  }

  return sequenceAttemptStats;
}

export async function create(
  supabase: SupabaseClient,
  input: CreateUserSequenceAttemptInput,
): Promise<UserSequenceAttempt | null> {
  const row: Record<string, unknown> = {
    user_id: input.userId,
    sequence_id: input.sequenceId,
    status: input.status ?? "started",
    completed_at: input.completedAt ?? null,
    duration_ms: input.durationMs ?? 0,
    correct_move_count: input.correctMoveCount ?? 0,
    wrong_move_count: input.wrongMoveCount ?? 0,
    hint_count: input.hintCount ?? 0,
    max_correct_streak: input.maxCorrectStreak ?? 0,
  };
  if (input.startedAt !== undefined) row.started_at = input.startedAt;

  const { data, error } = await supabase.from("user_sequence_attempts").insert(row).select().single();

  if (error) {
    console.error("user-sequence-attempt.repository.create error:", error);
    return null;
  }

  return toUserSequenceAttempt(data);
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateUserSequenceAttemptInput,
): Promise<UserSequenceAttempt | null> {
  const updates: Record<string, unknown> = {};
  if (input.status !== undefined) updates.status = input.status;
  if (input.completedAt !== undefined) updates.completed_at = input.completedAt;
  if (input.durationMs !== undefined) updates.duration_ms = input.durationMs;
  if (input.correctMoveCount !== undefined) updates.correct_move_count = input.correctMoveCount;
  if (input.wrongMoveCount !== undefined) updates.wrong_move_count = input.wrongMoveCount;
  if (input.hintCount !== undefined) updates.hint_count = input.hintCount;
  if (input.maxCorrectStreak !== undefined) updates.max_correct_streak = input.maxCorrectStreak;

  const { data, error } = await supabase.from("user_sequence_attempts").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("user-sequence-attempt.repository.update error:", error);
    return null;
  }

  return toUserSequenceAttempt(data);
}
