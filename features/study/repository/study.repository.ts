import type { SupabaseClient } from "@supabase/supabase-js";

import { toStudyWithPuzzleCountAndThemes } from "@/features/study-theme/mapper/study-theme.mapper";
import { DEFAULT_STUDY_DIFFICULTY } from "@/features/study/constants/study-difficulty.constants";
import { toStudy, toStudyWithPuzzleCount } from "@/features/study/mapper/study.mapper";
import type { Study, StudyWithPuzzleCount, StudyWithPuzzleCountAndThemes } from "@/features/study/types/study";
import type { CreateStudyPayload, UpdateStudyPayload } from "@/features/study/types/study-payload";
import { slugify } from "@/lib/utils/slugify";

function slugFromTitle(title: string): string {
  return slugify(title) || "study";
}

// ============================================================================
// Finding all studies
// ============================================================================
export async function findAllStudies(supabase: SupabaseClient): Promise<Study[]> {
  const { data, error } = await supabase
    .from("studies")
    .select("*")
    .order("sort_order", { ascending: true }) // increasing order
    .order("title", { ascending: true });

  if (error) {
    console.error("study.repository.findAllStudies error:", error);
    return [];
  }

  return (data ?? []).map(toStudy);
}

const STUDY_WITH_PUZZLE_COUNT_AND_THEMES_SELECT =
  "*, study_puzzles(count), study_themes(id, study_id, theme_id, weight, created_at, themes(*))";

// ============================================================================
// Finding all studies with Puzzle Count
// ============================================================================
export async function findAllStudiesWithPuzzleCount(supabase: SupabaseClient): Promise<StudyWithPuzzleCount[]> {
  const { data, error } = await supabase
    .from("studies")
    .select("*, study_puzzles(count)")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("study.repository.findAllStudiesWithPuzzleCount error:", error);
    return [];
  }

  return (data ?? []).map(toStudyWithPuzzleCount);
}

// ============================================================================
// Finding all ACTIVE studies with Puzzle Count and Themes
// ============================================================================
export async function findAllActiveStudiesWithPuzzleCountAndThemes(
  supabase: SupabaseClient,
): Promise<StudyWithPuzzleCountAndThemes[]> {
  const { data, error } = await supabase
    .from("studies")
    .select(STUDY_WITH_PUZZLE_COUNT_AND_THEMES_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("study.repository.findAllActiveStudiesWithPuzzleCountAndThemes error:", error);
    return [];
  }

  return (data ?? []).map((row) => toStudyWithPuzzleCountAndThemes(row));
}

// ============================================================================
// Finding study by Id
// ============================================================================
export async function findStudyById(supabase: SupabaseClient, id: string): Promise<Study | null> {
  const { data, error } = await supabase.from("studies").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("study.repository.findStudyById error:", error);
    return null;
  }

  if (!data) return null;

  return toStudy(data);
}

// ============================================================================
// Finding study by Slug
// ============================================================================
export async function findStudyBySlug(supabase: SupabaseClient, slug: string): Promise<Study | null> {
  const { data, error } = await supabase.from("studies").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("study.repository.findStudyBySlug error:", error);
    return null;
  }

  if (!data) return null;

  return toStudy(data);
}

// ============================================================================
// Creating a study
// ============================================================================
export async function createStudy(supabase: SupabaseClient, payload: CreateStudyPayload): Promise<Study | null> {
  const { data, error } = await supabase
    .from("studies")
    .insert({
      title: payload.title.trim(),
      slug: payload.slug?.trim() || slugFromTitle(payload.title),
      description: payload.description.trim(),
      cover_image_url: payload.coverImageUrl,
      cover_image_color: payload.coverImageColor,
      difficulty: payload.difficulty ?? DEFAULT_STUDY_DIFFICULTY,
      sort_order: payload.sortOrder ?? 0,
      is_active: payload.isActive ?? true,
      created_by: payload.createdBy ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("study.repository.createStudy error:", error);
    return null;
  }

  return toStudy(data);
}

// ============================================================================
// Updating a study
// ============================================================================
export async function updateStudy(
  supabase: SupabaseClient,
  id: string,
  payload: UpdateStudyPayload,
): Promise<Study | null> {
  const updates: Record<string, unknown> = {};
  if (payload.title !== undefined) updates.title = payload.title.trim();
  if (payload.slug !== undefined) updates.slug = payload.slug.trim();
  if (payload.description !== undefined) updates.description = payload.description.trim();
  if (payload.coverImageUrl !== undefined) updates.cover_image_url = payload.coverImageUrl;
  if (payload.coverImageColor !== undefined) updates.cover_image_color = payload.coverImageColor;
  if (payload.difficulty !== undefined) updates.difficulty = payload.difficulty;
  if (payload.sortOrder !== undefined) updates.sort_order = payload.sortOrder;
  if (payload.isActive !== undefined) updates.is_active = payload.isActive;

  const { data, error } = await supabase.from("studies").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("study.repository.updateStudy error:", error);
    return null;
  }

  return toStudy(data);
}

// ============================================================================
// Deleting a study
// ============================================================================
export async function removeStudy(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("studies").delete().eq("id", id);

  if (error) {
    console.error("study.repository.removeStudy error:", error);
    return false;
  }

  return true;
}
