import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import {
  type DbUserSequenceAttempt,
  mapDbToSequenceAttemptStats,
  toUserSequenceAttempt,
} from "@/features/user-sequence-attempt/mapper/user-sequence-attempt.mapper";
import type {
  SaveSequenceAttemptInput,
  SavedSequenceAttempt,
  SequenceAttemptStats,
  SequenceAttemptWriteError,
  SequenceAttemptWriteResult,
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
// Getting finished attempts by user (completed or failed), newest first.
// Used by puzzles history to list sequences the user actually tried to solve.
// ================================================================================================
export async function findFinishedAttemptsByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserSequenceAttempt[]> {
  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["completed", "failed"])
    .order("started_at", { ascending: false });

  if (error) {
    console.error("user-sequence-attempt.repository.findFinishedAttemptsByUserId error:", error);
    return [];
  }

  return (data ?? []).map(toUserSequenceAttempt);
}

// ================================================================================================
// Latest distinct sequence ids the user completed, newest first.
// Extra rows are read so repeated attempts on one puzzle still fill the requested window.
// ================================================================================================
export async function findRecentCompletedSequenceIds(
  supabase: SupabaseClient,
  userId: string,
  limit: number,
): Promise<string[]> {
  if (limit < 1) return [];

  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("sequence_id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("started_at", { ascending: false })
    .limit(Math.max(limit * 10, limit));

  if (error) {
    console.error("user-sequence-attempt.repository.findRecentCompletedSequenceIds error:", error);
    return [];
  }

  const sequenceIds: string[] = [];
  const seen = new Set<string>();
  for (const row of data ?? []) {
    if (typeof row.sequence_id !== "string" || seen.has(row.sequence_id)) continue;
    seen.add(row.sequence_id);
    sequenceIds.push(row.sequence_id);
    if (sequenceIds.length === limit) break;
  }

  return sequenceIds;
}

// ================================================================================================
// Getting all attempts by user since a timestamp (inclusive).
// Used by Grand Volt to load every attempt in the lookback window in one query,
// instead of fetching per-sequence like study pages do.
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
// Study has multiple puzzles. Puzzles have multiple solving attempts.
// This function returns the latest attempt summary for each sequenceId in the study.
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

// ================================================================================================
// Writes. Clients cannot write user_sequence_attempts; these call SECURITY DEFINER functions that only the
// service role may execute. Pass the admin client and the user id of the verified session, never one from a request.
// ================================================================================================
const WRITE_ERRORS: SequenceAttemptWriteError[] = [
  "sequence_not_found",
  "attempt_not_found",
  "attempt_sequence_mismatch",
  "attempt_already_finished",
  "invalid_attempt_counters",
];

function toWriteError(source: string, error: PostgrestError): SequenceAttemptWriteError {
  const code = WRITE_ERRORS.find((known) => known === error.message);
  if (code) return code;

  console.error(`user-sequence-attempt.repository.${source} error:`, error);
  return "failed";
}

export async function start(
  admin: SupabaseClient,
  userId: string,
  sequenceId: string,
): Promise<SequenceAttemptWriteResult<UserSequenceAttempt>> {
  const { data, error } = await admin.rpc("start_sequence_attempt", {
    p_user_id: userId,
    p_sequence_id: sequenceId,
  });

  if (error) return { ok: false, code: toWriteError("start", error) };

  return { ok: true, value: toUserSequenceAttempt(data as DbUserSequenceAttempt) };
}

// Progress ("started") or finish. The rating changes in the same transaction; see save_sequence_attempt.
export async function save(
  admin: SupabaseClient,
  userId: string,
  input: SaveSequenceAttemptInput,
): Promise<SequenceAttemptWriteResult<SavedSequenceAttempt>> {
  const { data, error } = await admin.rpc("save_sequence_attempt", {
    p_user_id: userId,
    p_attempt_id: input.attemptId,
    p_sequence_id: input.sequenceId,
    p_status: input.status,
    p_duration_ms: input.durationMs ?? null,
    p_correct_move_count: input.correctMoveCount ?? null,
    p_wrong_move_count: input.wrongMoveCount ?? null,
    p_hint_count: input.hintCount ?? null,
    p_max_correct_streak: input.maxCorrectStreak ?? null,
  });

  if (error) return { ok: false, code: toWriteError("save", error) };

  const result = data as { attempt: DbUserSequenceAttempt; rating_delta: number | null; current_rating: number | null };
  return {
    ok: true,
    value: {
      attempt: toUserSequenceAttempt(result.attempt),
      ratingDelta: result.rating_delta,
      currentRating: result.current_rating,
    },
  };
}
