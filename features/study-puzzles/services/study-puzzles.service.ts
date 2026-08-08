/**
 * Study Puzzles Service
 *
 * Responsibility: Business logic for study_puzzles join rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Puzzle } from "@/features/puzzle/types/puzzle";
import * as studyPuzzleRepo from "@/features/study-puzzles/repository/study-puzzle.repository";
import type { StudyPuzzle } from "@/features/study-puzzles/types/study-puzzle";

export async function getStudyPuzzlesByPuzzleId(supabase: SupabaseClient, puzzleId: string): Promise<StudyPuzzle[]> {
  return studyPuzzleRepo.findByPuzzleId(supabase, puzzleId);
}

export async function getActivePuzzlesByStudyId(
  supabase: SupabaseClient,
  studyId: string,
  input: studyPuzzleRepo.FindActiveByStudyIdInput = {},
): Promise<Puzzle[]> {
  return studyPuzzleRepo.findActiveByStudyId(supabase, studyId, input);
}

export async function getActivePuzzlesCountByStudyId(supabase: SupabaseClient, studyId: string): Promise<number> {
  return studyPuzzleRepo.countActiveByStudyId(supabase, studyId);
}

export async function addPuzzleToStudy(
  supabase: SupabaseClient,
  input: studyPuzzleRepo.CreateStudyPuzzleInput,
): Promise<StudyPuzzle | null> {
  return studyPuzzleRepo.create(supabase, input);
}
