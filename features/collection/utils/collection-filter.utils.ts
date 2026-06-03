import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";
import type { Theme } from "@/features/theme/types/theme";

export const COLLECTION_DIFFICULTY_BANDS = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
  "master",
  "grandmaster",
] as const;

export type CollectionDifficultyBand = (typeof COLLECTION_DIFFICULTY_BANDS)[number];

export const COLLECTION_DIFFICULTY_BAND_OPTIONS: { value: CollectionDifficultyBand; label: string }[] = [
  { value: "all", label: "All difficulties" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "master", label: "Master" },
  { value: "grandmaster", label: "Grandmaster" },
];

export type CollectionFilterState = {
  difficultyBand: CollectionDifficultyBand;
  themeSlug: string;
};

function matchesDifficultyBand(difficulty: CollectionDifficulty, band: CollectionDifficultyBand): boolean {
  if (band === "all") return true;
  if (band === "beginner") return difficulty <= 2;
  if (band === "intermediate") return difficulty >= 3 && difficulty <= 4;
  if (band === "advanced") return difficulty >= 5 && difficulty <= 6;
  if (band === "master") return difficulty >= 7 && difficulty <= 8;
  return difficulty >= 9;
}

export function getThemeFilterOptions(collections: CollectionWithRiddleCountAndThemes[]): Theme[] {
  const themesBySlug = new Map<string, Theme>();

  for (const collection of collections) {
    for (const { theme } of collection.themes) {
      if (!themesBySlug.has(theme.slug)) {
        themesBySlug.set(theme.slug, theme);
      }
    }
  }

  return [...themesBySlug.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export function filterCollections(
  collections: CollectionWithRiddleCountAndThemes[],
  filters: CollectionFilterState,
): CollectionWithRiddleCountAndThemes[] {
  const themeSlug = filters.themeSlug.trim();

  return collections.filter((collection) => {
    const matchesDifficulty = matchesDifficultyBand(collection.difficulty, filters.difficultyBand);
    const matchesTheme =
      themeSlug === "all" || themeSlug === "" || collection.themes.some((item) => item.theme.slug === themeSlug);

    return matchesDifficulty && matchesTheme;
  });
}

export function hasActiveCollectionFilters(filters: CollectionFilterState): boolean {
  return filters.difficultyBand !== "all" || (filters.themeSlug !== "all" && filters.themeSlug.trim() !== "");
}
