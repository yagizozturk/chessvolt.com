/**
 * Study Riddle Repository
 *
 * Responsibility: CRUD access to the study_riddles join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { type DbRiddle, toRiddle } from "@/features/riddle/mapper/riddle.mapper";
import type { Riddle } from "@/features/riddle/types/riddle";
import { toStudyRiddle } from "@/features/study-riddles/mapper/study-riddle.mapper";
import type { StudyRiddle } from "@/features/study-riddles/types/study-riddle";

export async function findByRiddleId(supabase: SupabaseClient, riddleId: string): Promise<StudyRiddle[]> {
  const { data, error } = await supabase
    .from("study_riddles")
    .select("*")
    .eq("riddle_id", riddleId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("study-riddle.repository.findByRiddleId error:", error);
    return [];
  }

  return (data ?? []).map(toStudyRiddle);
}

type DbStudyRiddleJoinRow = {
  sort_order: number;
  created_at: string;
  riddles: DbRiddle | DbRiddle[] | null;
};

export type FindActiveByStudyIdInput = {
  offset?: number;
  limit?: number;
};

function mapStudyRiddleJoinRows(rows: DbStudyRiddleJoinRow[]): Riddle[] {
  return rows
    .map((joinRow) => {
      const riddleRow = Array.isArray(joinRow.riddles) ? joinRow.riddles[0] : joinRow.riddles;
      if (!riddleRow) return null;
      if (!riddleRow.is_active) return null;
      return toRiddle(riddleRow);
    })
    .filter((riddle): riddle is Riddle => riddle != null);
}

export async function countActiveByStudyId(supabase: SupabaseClient, studyId: string): Promise<number> {
  const { count, error } = await supabase
    .from("study_riddles")
    .select("riddles!inner(id)", { count: "exact", head: true })
    .eq("study_id", studyId)
    .eq("riddles.is_active", true);

  if (error) {
    console.error("study-riddle.repository.countActiveByStudyId error:", error);
    return 0;
  }

  return count ?? 0;
}

export async function findActiveByStudyId(
  supabase: SupabaseClient,
  studyId: string,
  input: FindActiveByStudyIdInput = {},
): Promise<Riddle[]> {
  let query = supabase
    .from("study_riddles")
    .select("sort_order, created_at, riddles (*, move_sequences (*))")
    .eq("study_id", studyId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (input.offset != null && input.limit != null) {
    query = query.range(input.offset, input.offset + input.limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("study-riddle.repository.findActiveByStudyId error:", error);
    return [];
  }

  return mapStudyRiddleJoinRows((data ?? []) as DbStudyRiddleJoinRow[]);
}

export type CreateStudyRiddleInput = {
  riddleId: string;
  studyId: string;
  sortOrder?: number;
};

export async function create(supabase: SupabaseClient, input: CreateStudyRiddleInput): Promise<StudyRiddle | null> {
  const { data, error } = await supabase
    .from("study_riddles")
    .insert({
      riddle_id: input.riddleId,
      study_id: input.studyId,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("study-riddle.repository.create error:", error);
    return null;
  }

  return toStudyRiddle(data);
}
