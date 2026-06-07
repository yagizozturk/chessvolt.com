/**
 * Riddle Theme Service
 *
 * Responsibility: Link riddles to themes through content_themes only.
 */

import * as contentThemeRepo from "@/features/content-theme/repository/content-theme.repository";
import * as contentThemeService from "@/features/content-theme/services/content-theme.service";
import { clampContentThemeWeight } from "@/features/content-theme/types/content-theme-weight";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";
import type { Riddle } from "@/features/riddle/types/riddle";
import * as themeRepo from "@/features/theme/repository/theme.repository";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function findRiddleIdsByThemeSlugs(
  supabase: SupabaseClient,
  themeSlugs: string[],
): Promise<string[]> {
  const uniqueSlugs = [...new Set(themeSlugs.map((slug) => slug.trim()).filter(Boolean))];
  if (uniqueSlugs.length === 0) return [];

  const themes = await themeRepo.findBySlugs(supabase, uniqueSlugs);
  if (themes.length === 0) return [];

  const themeIds = themes.map((theme) => theme.id);
  const { data, error } = await supabase
    .from("content_themes")
    .select("content_id")
    .eq("content_type", "riddle")
    .in("theme_id", themeIds);

  if (error) {
    console.error("riddle-theme.service.findRiddleIdsByThemeSlugs error:", error);
    return [];
  }

  return [
    ...new Set(
      (data ?? [])
        .map((row) => row.content_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];
}

export async function getThemeSlugsByRiddleIds(
  supabase: SupabaseClient,
  riddleIds: string[],
): Promise<Map<string, string[]>> {
  const uniqueIds = [...new Set(riddleIds.map((id) => id.trim()).filter(Boolean))];
  const slugsByRiddleId = new Map<string, string[]>();
  if (uniqueIds.length === 0) return slugsByRiddleId;

  const contentThemes = await contentThemeRepo.findByContentTypeForContentIds(
    supabase,
    "riddle",
    uniqueIds,
  );

  for (const row of contentThemes) {
    const existing = slugsByRiddleId.get(row.contentId) ?? [];
    existing.push(row.theme.slug);
    slugsByRiddleId.set(row.contentId, existing);
  }

  return slugsByRiddleId;
}

export function withThemeSlugs(riddle: Riddle, themeSlugs: string[]): RiddleWithThemes {
  return { ...riddle, themeSlugs };
}

export async function attachThemeSlugsToRiddles(
  supabase: SupabaseClient,
  riddles: Riddle[],
): Promise<RiddleWithThemes[]> {
  if (riddles.length === 0) return [];

  const slugsByRiddleId = await getThemeSlugsByRiddleIds(
    supabase,
    riddles.map((riddle) => riddle.id),
  );

  return riddles.map((riddle) =>
    withThemeSlugs(riddle, slugsByRiddleId.get(riddle.id) ?? []),
  );
}

export async function syncRiddleThemesFromSlugs(
  supabase: SupabaseClient,
  riddleId: string,
  themeSlugs: string[],
): Promise<boolean> {
  const uniqueSlugs = [...new Set(themeSlugs.map((slug) => slug.trim()).filter(Boolean))];

  if (uniqueSlugs.length === 0) {
    return contentThemeService.deleteContentThemesForContent(supabase, "riddle", riddleId);
  }

  const themes = await themeRepo.findBySlugs(supabase, uniqueSlugs);
  const themesBySlug = new Map(themes.map((theme) => [theme.slug, theme]));

  const orderedThemes = uniqueSlugs
    .map((slug) => themesBySlug.get(slug))
    .filter((theme): theme is NonNullable<typeof theme> => theme != null);

  const defaultByOrder = [10, 8, 7, 6, 5];
  const inputs = orderedThemes.map((theme, index) => ({
    contentType: "riddle" as const,
    contentId: riddleId,
    themeId: theme.id,
    weight: clampContentThemeWeight(defaultByOrder[index] ?? 1),
  }));

  const result = await contentThemeService.setContentThemesForContent(
    supabase,
    "riddle",
    riddleId,
    inputs,
  );

  return result.length === inputs.length;
}
