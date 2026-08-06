/**
 * Study Theme Repository
 *
 * Responsibility: CRUD access to the study_themes join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbStudyTheme,
  type DbStudyThemeWithTheme,
  toStudyTheme,
  toStudyThemeWithTheme,
  toStudyThemesWithTheme,
} from "@/features/study-theme/mapper/study-theme.mapper";
import type { StudyTheme, StudyThemeWithTheme } from "@/features/study-theme/types/study-theme";
import { DEFAULT_THEME_LINK_WEIGHT, type ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";

const SELECT = "*";
const WITH_THEME_SELECT = "*, themes (*)";

export async function findById(supabase: SupabaseClient, id: string): Promise<StudyTheme | null> {
  const { data, error } = await supabase.from("study_themes").select(SELECT).eq("id", id).maybeSingle();

  if (error) {
    console.error("study-theme.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toStudyTheme(data as DbStudyTheme);
}

export async function findByIdWithTheme(supabase: SupabaseClient, id: string): Promise<StudyThemeWithTheme | null> {
  const { data, error } = await supabase.from("study_themes").select(WITH_THEME_SELECT).eq("id", id).maybeSingle();

  if (error) {
    console.error("study-theme.repository.findByIdWithTheme error:", error);
    return null;
  }

  if (!data) return null;

  return toStudyThemeWithTheme(data as DbStudyThemeWithTheme);
}

export async function findAllWithTheme(supabase: SupabaseClient): Promise<StudyThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("study_themes")
    .select(WITH_THEME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("study-theme.repository.findAllWithTheme error:", error);
    return [];
  }

  return toStudyThemesWithTheme((data ?? []) as DbStudyThemeWithTheme[]);
}

export async function findByStudyIdWithTheme(
  supabase: SupabaseClient,
  studyId: string,
): Promise<StudyThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("study_themes")
    .select(WITH_THEME_SELECT)
    .eq("study_id", studyId)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("study-theme.repository.findByStudyIdWithTheme error:", error);
    return [];
  }

  return toStudyThemesWithTheme((data ?? []) as DbStudyThemeWithTheme[]);
}

export type CreateStudyThemeInput = {
  studyId: string;
  themeId: string;
  weight?: ThemeLinkWeight;
};

export async function create(supabase: SupabaseClient, input: CreateStudyThemeInput): Promise<StudyTheme | null> {
  const { data, error } = await supabase
    .from("study_themes")
    .insert({
      study_id: input.studyId,
      theme_id: input.themeId,
      weight: input.weight ?? DEFAULT_THEME_LINK_WEIGHT,
    })
    .select()
    .single();

  if (error) {
    console.error("study-theme.repository.create error:", error);
    return null;
  }

  return toStudyTheme(data as DbStudyTheme);
}

export type UpdateStudyThemeInput = {
  weight?: ThemeLinkWeight;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateStudyThemeInput,
): Promise<StudyTheme | null> {
  const updates: Record<string, unknown> = {};
  if (input.weight !== undefined) updates.weight = input.weight;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase.from("study_themes").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("study-theme.repository.update error:", error);
    return null;
  }

  return toStudyTheme(data as DbStudyTheme);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("study_themes").delete().eq("id", id);

  if (error) {
    console.error("study-theme.repository.remove error:", error);
    return false;
  }

  return true;
}
