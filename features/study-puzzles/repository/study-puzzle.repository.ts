/**
 * Study Puzzle Repository
 *
 * Responsibility: CRUD access to the study_puzzles join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { type DbPuzzle, toPuzzle } from "@/features/puzzle/mapper/puzzle.mapper";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { toStudyPuzzle } from "@/features/study-puzzles/mapper/study-puzzle.mapper";
import type { StudyPuzzle } from "@/features/study-puzzles/types/study-puzzle";

export async function findByPuzzleId(supabase: SupabaseClient, puzzleId: string): Promise<StudyPuzzle[]> {
  const { data, error } = await supabase
    .from("study_puzzles")
    .select("*")
    .eq("puzzle_id", puzzleId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("study-puzzle.repository.findByPuzzleId error:", error);
    return [];
  }

  return (data ?? []).map(toStudyPuzzle);
}

type DbStudyPuzzleJoinRow = {
  sort_order: number;
  created_at: string;
  puzzles: DbPuzzle | DbPuzzle[] | null;
};

export type FindActiveByStudyIdInput = {
  offset?: number;
  limit?: number;
};

function mapStudyPuzzleJoinRows(rows: DbStudyPuzzleJoinRow[]): Puzzle[] {
  return rows
    .map((joinRow) => {
      const puzzleRow = Array.isArray(joinRow.puzzles) ? joinRow.puzzles[0] : joinRow.puzzles;
      if (!puzzleRow) return null;
      if (!puzzleRow.is_active) return null;
      return toPuzzle(puzzleRow);
    })
    .filter((puzzle): puzzle is Puzzle => puzzle != null);
}

export async function countActiveByStudyId(supabase: SupabaseClient, studyId: string): Promise<number> {
  const { count, error } = await supabase
    .from("study_puzzles")
    .select("puzzles!inner(id)", { count: "exact", head: true })
    .eq("study_id", studyId)
    .eq("puzzles.is_active", true);

  if (error) {
    console.error("study-puzzle.repository.countActiveByStudyId error:", error);
    return 0;
  }

  return count ?? 0;
}

export async function findActiveByStudyId(
  supabase: SupabaseClient,
  studyId: string,
  input: FindActiveByStudyIdInput = {},
): Promise<Puzzle[]> {
  let query = supabase
    .from("study_puzzles")
    .select("sort_order, created_at, puzzles (*, move_sequences (*))")
    .eq("study_id", studyId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (input.offset != null && input.limit != null) {
    query = query.range(input.offset, input.offset + input.limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("study-puzzle.repository.findActiveByStudyId error:", error);
    return [];
  }

  return mapStudyPuzzleJoinRows((data ?? []) as DbStudyPuzzleJoinRow[]);
}

export type CreateStudyPuzzleInput = {
  puzzleId: string;
  studyId: string;
  sortOrder?: number;
};

export async function create(supabase: SupabaseClient, input: CreateStudyPuzzleInput): Promise<StudyPuzzle | null> {
  const { data, error } = await supabase
    .from("study_puzzles")
    .insert({
      puzzle_id: input.puzzleId,
      study_id: input.studyId,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("study-puzzle.repository.create error:", error);
    return null;
  }

  return toStudyPuzzle(data);
}
