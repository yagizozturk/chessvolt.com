// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";

import { DEFAULT_TOP_STUDY_THEME_COUNT } from "@/features/study-theme/mapper/study-theme.mapper";
import * as studyThemeRepo from "@/features/study-theme/repository/study-theme.repository";
import type { StudyTheme, StudyThemeWithTheme } from "@/features/study-theme/types/study-theme";

export { DEFAULT_TOP_STUDY_THEME_COUNT };

export async function getStudyThemesForStudyWithTheme(
  supabase: SupabaseClient,
  studyId: string,
): Promise<StudyThemeWithTheme[]> {
  return studyThemeRepo.findByStudyIdWithTheme(supabase, studyId);
}

export async function addStudyTheme(
  supabase: SupabaseClient,
  input: studyThemeRepo.CreateStudyThemeInput,
): Promise<StudyTheme | null> {
  return studyThemeRepo.create(supabase, input);
}

export async function updateStudyTheme(
  supabase: SupabaseClient,
  id: string,
  input: studyThemeRepo.UpdateStudyThemeInput,
): Promise<StudyTheme | null> {
  return studyThemeRepo.update(supabase, id, input);
}

export async function deleteStudyTheme(supabase: SupabaseClient, id: string): Promise<boolean> {
  return studyThemeRepo.remove(supabase, id);
}
