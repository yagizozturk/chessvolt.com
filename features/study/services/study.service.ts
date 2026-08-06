import type { SupabaseClient } from "@supabase/supabase-js";

import * as studyRepo from "@/features/study/repository/study.repository";
import type { Study, StudyWithRiddleCount, StudyWithRiddleCountAndThemes } from "@/features/study/types/study";
import type { CreateStudyPayload, UpdateStudyPayload } from "@/features/study/types/study-payload";

// ============================================================================
// Getting all studies
// ============================================================================
export async function getAllStudies(supabase: SupabaseClient): Promise<Study[]> {
  return studyRepo.findAllStudies(supabase);
}

// ============================================================================
// Getting all studies with Riddle Count
// ============================================================================
export async function getAllStudiesWithRiddleCount(supabase: SupabaseClient): Promise<StudyWithRiddleCount[]> {
  return studyRepo.findAllStudiesWithRiddleCount(supabase);
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
// Getting ACTIVE studies with Riddle Count and Themes related
// ============================================================================
export async function getActiveStudiesWithRiddleCountAndThemes(
  supabase: SupabaseClient,
): Promise<StudyWithRiddleCountAndThemes[]> {
  return studyRepo.findAllActiveStudiesWithRiddleCountAndThemes(supabase);
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
