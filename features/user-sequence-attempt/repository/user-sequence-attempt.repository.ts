/**
 * User Sequence Attempt Repository
 *
 * Responsibility: CRUD access to user_sequence_attempts.
 */
import {
  toSequenceAttemptSummary,
  toUserSequenceAttempt,
} from "@/features/user-sequence-attempt/mapper/user-sequence-attempt.mapper";
import type {
  CreateUserSequenceAttemptInput,
  SequenceAttemptSummary,
  UpdateUserSequenceAttemptInput,
  UserSequenceAttempt,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<UserSequenceAttempt | null> {
  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("user-sequence-attempt.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toUserSequenceAttempt(data);
}

export async function findByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserSequenceAttempt[]> {
  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("user-sequence-attempt.repository.findByUserId error:", error);
    return [];
  }

  return (data ?? []).map(toUserSequenceAttempt);
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

export async function findLatestByUserAndSequenceId(
  supabase: SupabaseClient,
  userId: string,
  sequenceId: string,
): Promise<UserSequenceAttempt | null> {
  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("sequence_id", sequenceId)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("user-sequence-attempt.repository.findLatestByUserAndSequenceId error:", error);
    return null;
  }

  if (!data) return null;

  return toUserSequenceAttempt(data);
}

/** Latest attempt per sequence for the given ids (one row per sequence). */
export async function findLatestSummariesForSequences(
  supabase: SupabaseClient,
  userId: string,
  sequenceIds: string[],
): Promise<SequenceAttemptSummary[]> {
  if (sequenceIds.length === 0) return [];

  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("*")
    .eq("user_id", userId)
    .in("sequence_id", sequenceIds)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("user-sequence-attempt.repository.findLatestSummariesForSequences error:", error);
    return [];
  }

  const seen = new Set<string>();
  const summaries: SequenceAttemptSummary[] = [];

  for (const row of data ?? []) {
    if (seen.has(row.sequence_id)) continue;
    seen.add(row.sequence_id);
    summaries.push(toSequenceAttemptSummary(row));
  }

  return summaries;
}

export async function findCompletedSequenceIds(
  supabase: SupabaseClient,
  userId: string,
  sequenceIds: string[],
): Promise<Set<string>> {
  if (sequenceIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .select("sequence_id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .in("sequence_id", sequenceIds);

  if (error) {
    console.error("user-sequence-attempt.repository.findCompletedSequenceIds error:", error);
    return new Set();
  }

  return new Set(data?.map((r) => r.sequence_id as string) ?? []);
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

  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .insert(row)
    .select()
    .single();

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

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase
    .from("user_sequence_attempts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("user-sequence-attempt.repository.update error:", error);
    return null;
  }

  return toUserSequenceAttempt(data);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("user_sequence_attempts").delete().eq("id", id);

  if (error) {
    console.error("user-sequence-attempt.repository.remove error:", error);
    return false;
  }

  return true;
}
