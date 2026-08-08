import type { SupabaseClient } from "@supabase/supabase-js";

import * as studyRepo from "@/features/study/repository/study.repository";
import type { Study, StudyWithPuzzleCount, StudyWithPuzzleCountAndThemes } from "@/features/study/types/study";
import type { CreateStudyPayload, UpdateStudyPayload } from "@/features/study/types/study-payload";

// ============================================================================
// Getting all studies
// ============================================================================
export async function getAllStudies(supabase: SupabaseClient): Promise<Study[]> {
  return studyRepo.findAllStudies(supabase);
}

// ============================================================================
// Getting all studies with Puzzle Count
// ============================================================================
export async function getAllStudiesWithPuzzleCount(supabase: SupabaseClient): Promise<StudyWithPuzzleCount[]> {
  return studyRepo.findAllStudiesWithPuzzleCount(supabase);
}

// ============================================================================
// Getting study by Id
// ============================================================================
export async function getStudyById(supabase: SupabaseClient, id: string): Promise<Study | null> {
  return studyRepo.findStudyById(supabase, id);
}

// ============================================================================
// Getting study by Slug
// ============================================================================
export async function getStudyBySlug(supabase: SupabaseClient, slug: string): Promise<Study | null> {
  return studyRepo.findStudyBySlug(supabase, slug);
}

// ============================================================================
// Getting ACTIVE studies with Puzzle Count and Themes related
// ============================================================================
export async function getActiveStudiesWithPuzzleCountAndThemes(
  supabase: SupabaseClient,
): Promise<StudyWithPuzzleCountAndThemes[]> {
  return studyRepo.findAllActiveStudiesWithPuzzleCountAndThemes(supabase);
}

// ============================================================================
// Creating a study
// ============================================================================
export async function createStudy(supabase: SupabaseClient, payload: CreateStudyPayload): Promise<Study | null> {
  return studyRepo.createStudy(supabase, payload);
}

// ============================================================================
// Updating a study
// ============================================================================
export async function updateStudy(
  supabase: SupabaseClient,
  id: string,
  payload: UpdateStudyPayload,
): Promise<Study | null> {
  return studyRepo.updateStudy(supabase, id, payload);
}

// ============================================================================
// Deleting a study
// ============================================================================
export async function deleteStudy(supabase: SupabaseClient, id: string): Promise<boolean> {
  return studyRepo.removeStudy(supabase, id);
}
