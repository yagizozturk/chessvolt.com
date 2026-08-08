/**
 * Puzzle Theme Service
 *
 * Responsibility: Link puzzles to themes through puzzle_themes.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as puzzleThemeRepo from "@/features/puzzle-theme/repository/puzzle-theme.repository";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import type { PuzzleWithThemes } from "@/features/puzzle/types/puzzle-with-themes";
import { clampThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import * as themeRepo from "@/features/theme/repository/theme.repository";
import type { Theme } from "@/features/theme/types/theme";

export type PrimaryPuzzleTheme = Pick<Theme, "title" | "slug">;

export async function getPrimaryThemesByPuzzleIds(
  supabase: SupabaseClient,
  puzzleIds: string[],
): Promise<Map<string, PrimaryPuzzleTheme>> {
  const uniqueIds = [...new Set(puzzleIds.map((id) => id.trim()).filter(Boolean))];
  const primaryByPuzzleId = new Map<string, PrimaryPuzzleTheme>();
  if (uniqueIds.length === 0) return primaryByPuzzleId;

  const puzzleThemes = await puzzleThemeRepo.findByPuzzleIdsWithTheme(supabase, uniqueIds);

  for (const row of puzzleThemes) {
    if (primaryByPuzzleId.has(row.puzzleId)) continue;
    primaryByPuzzleId.set(row.puzzleId, {
      title: row.theme.title,
      slug: row.theme.slug,
    });
  }

  return primaryByPuzzleId;
}

export async function getThemeSlugsByPuzzleIds(
  supabase: SupabaseClient,
  puzzleIds: string[],
): Promise<Map<string, string[]>> {
  const uniqueIds = [...new Set(puzzleIds.map((id) => id.trim()).filter(Boolean))];
  const slugsByPuzzleId = new Map<string, string[]>();
  if (uniqueIds.length === 0) return slugsByPuzzleId;

  const puzzleThemes = await puzzleThemeRepo.findByPuzzleIdsWithTheme(supabase, uniqueIds);

  for (const row of puzzleThemes) {
    const existing = slugsByPuzzleId.get(row.puzzleId) ?? [];
    existing.push(row.theme.slug);
    slugsByPuzzleId.set(row.puzzleId, existing);
  }

  return slugsByPuzzleId;
}

export function withThemeSlugs(puzzle: Puzzle, themeSlugs: string[]): PuzzleWithThemes {
  return { ...puzzle, themeSlugs };
}

export async function syncPuzzleThemesFromSlugs(
  supabase: SupabaseClient,
  puzzleId: string,
  themeSlugs: string[],
): Promise<boolean> {
  const uniqueSlugs = [...new Set(themeSlugs.map((slug) => slug.trim()).filter(Boolean))];

  if (uniqueSlugs.length === 0) {
    return puzzleThemeRepo.removeByPuzzleId(supabase, puzzleId);
  }

  const themes = await themeRepo.findBySlugs(supabase, uniqueSlugs);
  const themesBySlug = new Map(themes.map((theme) => [theme.slug, theme]));

  const orderedThemes = uniqueSlugs
    .map((slug) => themesBySlug.get(slug))
    .filter((theme): theme is NonNullable<typeof theme> => theme != null);

  const defaultByOrder = [10, 8, 7, 6, 5];
  const inputs = orderedThemes.map((theme, index) => ({
    puzzleId,
    themeId: theme.id,
    weight: clampThemeLinkWeight(defaultByOrder[index] ?? 1),
  }));

  const result = await puzzleThemeRepo.replaceForPuzzle(supabase, puzzleId, inputs);

  return result.length === inputs.length;
}

export async function addPuzzleThemes(
  supabase: SupabaseClient,
  inputs: puzzleThemeRepo.CreatePuzzleThemeInput[],
): Promise<boolean> {
  const result = await puzzleThemeRepo.createMany(supabase, inputs);
  return result.length === inputs.length;
}
