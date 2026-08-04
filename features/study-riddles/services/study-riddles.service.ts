// TODO: Refactor
/**
 * Study Riddles Service
 *
 * Responsibility: Business logic for study_riddles join rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as studyRiddleRepo from "@/features/study-riddles/repository/study-riddle.repository";
import type { StudyRiddle } from "@/features/study-riddles/types/study-riddle";
import type { Riddle } from "@/features/riddle/types/riddle";

export async function getStudyRiddlesByRiddleId(
  supabase: SupabaseClient,
  riddleId: string,
): Promise<StudyRiddle[]> {
  return studyRiddleRepo.findByRiddleId(supabase, riddleId);
}

export async function getActiveRiddlesByStudyId(
  supabase: SupabaseClient,
  studyId: string,
  input: studyRiddleRepo.FindActiveByStudyIdInput = {},
): Promise<Riddle[]> {
  return studyRiddleRepo.findActiveByStudyId(supabase, studyId, input);
}

export async function getActiveRiddlesCountByStudyId(
  supabase: SupabaseClient,
  studyId: string,
): Promise<number> {
  return studyRiddleRepo.countActiveByStudyId(supabase, studyId);
}

export async function addRiddleToStudy(
  supabase: SupabaseClient,
  input: studyRiddleRepo.CreateStudyRiddleInput,
): Promise<StudyRiddle | null> {
  return studyRiddleRepo.create(supabase, input);
}
