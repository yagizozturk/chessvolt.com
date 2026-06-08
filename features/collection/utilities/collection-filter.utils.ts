import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";
import type { Theme } from "@/features/theme/types/theme";

export const COLLECTION_DIFFICULTY_OPTIONS = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Master",
  "Grandmaster",
] as const;

export type CollectionDifficultyOptions = (typeof COLLECTION_DIFFICULTY_OPTIONS)[number];

// ============================================================================
// Collection filter state
// CollectionFilterState is differnet and not in types folder.
// It’s temporary client state for one list (searchQuery, difficultyFilter, themeFilter).
// Nothing is persisted; it only exists while filtering.
// ============================================================================
export type CollectionFilterState = {
  searchQuery: string;
  difficultyFilter: CollectionDifficultyOptions;
  themeFilter: string;
};

// ============================================================================
// Matches the difficulty option to the difficulty LEVEL
// ============================================================================
function matchesDifficultyOption(difficulty: CollectionDifficulty, option: CollectionDifficultyOptions): boolean {
  if (option === "All") return true;
  if (option === "Beginner") return difficulty <= 2;
  if (option === "Intermediate") return difficulty >= 3 && difficulty <= 4;
  if (option === "Advanced") return difficulty >= 5 && difficulty <= 6;
  if (option === "Master") return difficulty >= 7 && difficulty <= 8;
  return difficulty >= 9;
}

// ============================================================================
// Gets the theme filter options
// Multiple collections can share the same theme. When you loop every collection’s
// themes, the same theme.slug can show up many times. The Map keeps each theme once
// so the dropdown doesn’t list duplicates.
// ============================================================================
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

// ============================================================================
// Matches the search query to the collection
// Searching for title, description and even themes
// ============================================================================
function matchesSearchQuery(collection: CollectionWithRiddleCountAndThemes, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const searchableText = [
    collection.title,
    collection.description,
    ...collection.themes.map((item) => item.theme.title),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

// ============================================================================
// Filters the collections
// ============================================================================
export function filterCollections(
  collections: CollectionWithRiddleCountAndThemes[],
  filters: CollectionFilterState,
): CollectionWithRiddleCountAndThemes[] {
  // e.g. "all" (no theme filter), "" (same as no filter), or a theme slug like "tactics" | "endgames"
  const themeSlug = filters.themeFilter.trim();

  // e.g. [{ id: "…", title: "Italian Opening", difficulty: 2, riddleCount: 12, themes: [...] }] or [] when nothing matches
  return collections.filter((collection) => {
    const matchesSearch = matchesSearchQuery(collection, filters.searchQuery);
    const matchesDifficulty = matchesDifficultyOption(collection.difficulty, filters.difficultyFilter);
    const matchesTheme =
      themeSlug === "all" || themeSlug === "" || collection.themes.some((item) => item.theme.slug === themeSlug);

    // Per collection: true keeps it, false drops it (e.g. true when search="italian", difficultyFilter="Beginner", themeSlug="all" all match)
    return matchesSearch && matchesDifficulty && matchesTheme;
  });
}

// ============================================================================
// Checks if there are any active filters
// ============================================================================
export function hasActiveCollectionFilters(filters: CollectionFilterState): boolean {
  return (
    filters.searchQuery.trim() !== "" ||
    filters.difficultyFilter !== "All" ||
    (filters.themeFilter !== "all" && filters.themeFilter.trim() !== "")
  );
}
