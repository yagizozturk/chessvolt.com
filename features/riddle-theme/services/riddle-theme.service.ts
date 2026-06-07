/**
 * Riddle Theme Service
 *
 * Responsibility: Link riddles to themes through riddle_themes.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import * as riddleThemeRepo from "@/features/riddle-theme/repository/riddle-theme.repository";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";
import type { Riddle } from "@/features/riddle/types/riddle";
import { clampThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import * as themeRepo from "@/features/theme/repository/theme.repository";

export async function findRiddleIdsByThemeSlugs(
  supabase: SupabaseClient,
  themeSlugs: string[],
): Promise<string[]> {
  const uniqueSlugs = [...new Set(themeSlugs.map((slug) => slug.trim()).filter(Boolean))];
  if (uniqueSlugs.length === 0) return [];

  const themes = await themeRepo.findBySlugs(supabase, uniqueSlugs);
  if (themes.length === 0) return [];

  return riddleThemeRepo.findRiddleIdsByThemeIds(
    supabase,
    themes.map((theme) => theme.id),
  );
}

export async function getThemeSlugsByRiddleIds(
  supabase: SupabaseClient,
  riddleIds: string[],
): Promise<Map<string, string[]>> {
  const uniqueIds = [...new Set(riddleIds.map((id) => id.trim()).filter(Boolean))];
  const slugsByRiddleId = new Map<string, string[]>();
  if (uniqueIds.length === 0) return slugsByRiddleId;

  const riddleThemes = await riddleThemeRepo.findByRiddleIdsWithTheme(supabase, uniqueIds);

  for (const row of riddleThemes) {
    const existing = slugsByRiddleId.get(row.riddleId) ?? [];
    existing.push(row.theme.slug);
    slugsByRiddleId.set(row.riddleId, existing);
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

  return riddles.map((riddle) => withThemeSlugs(riddle, slugsByRiddleId.get(riddle.id) ?? []));
}

export async function syncRiddleThemesFromSlugs(
  supabase: SupabaseClient,
  riddleId: string,
  themeSlugs: string[],
): Promise<boolean> {
  const uniqueSlugs = [...new Set(themeSlugs.map((slug) => slug.trim()).filter(Boolean))];

  if (uniqueSlugs.length === 0) {
    return riddleThemeRepo.removeByRiddleId(supabase, riddleId);
  }

  const themes = await themeRepo.findBySlugs(supabase, uniqueSlugs);
  const themesBySlug = new Map(themes.map((theme) => [theme.slug, theme]));

  const orderedThemes = uniqueSlugs
    .map((slug) => themesBySlug.get(slug))
    .filter((theme): theme is NonNullable<typeof theme> => theme != null);

  const defaultByOrder = [10, 8, 7, 6, 5];
  const inputs = orderedThemes.map((theme, index) => ({
    riddleId,
    themeId: theme.id,
    weight: clampThemeLinkWeight(defaultByOrder[index] ?? 1),
  }));

  const result = await riddleThemeRepo.replaceForRiddle(supabase, riddleId, inputs);

  return result.length === inputs.length;
}

export async function addRiddleThemes(
  supabase: SupabaseClient,
  inputs: riddleThemeRepo.CreateRiddleThemeInput[],
): Promise<boolean> {
  const result = await riddleThemeRepo.createMany(supabase, inputs);
  return result.length === inputs.length;
}
