import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";
import {
  COLLECTION_DIFFICULTY_OPTIONS,
  type CollectionDifficultyOptions,
  type CollectionFilterState,
} from "@/features/collection/types/collection-filter";
import type { Theme } from "@/features/theme/types/theme";

const COLLECTION_PAGE_PATH = "/collection";

// ============================================================================
// Gets the theme options for filter
// Multiple collections can share the same theme. When you loop every collection’s
// themes, slug can show up many times. The Map keeps each theme once
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
// Parse filter data from URL
// ============================================================================
export function parseCollectionFilterStateFromUrl(params: {
  difficulty?: string;
  theme?: string;
  searchBox?: string;
}): CollectionFilterState {
  const difficultyParam = params.difficulty?.trim() ?? "";
  const difficultyFilter = COLLECTION_DIFFICULTY_OPTIONS.includes(difficultyParam as CollectionDifficultyOptions)
    ? (difficultyParam as CollectionDifficultyOptions)
    : "All";
  const themeFilter = params.theme?.trim() || "all";
  const searchQuery = params.searchBox?.trim() ?? "";

  return { searchQuery, difficultyFilter, themeFilter };
}

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
// Matches the search query to the collection
// Searching for title, description and even themes
// ============================================================================
function matchesSearchQuery(collection: CollectionWithRiddleCountAndThemes, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const searchableText = [
    collection.title,
    collection.description,
    // ... spread operator: it takes each theme title from the mapped array and inserts them
    // as separate items into searchableText array. So it looks for theme names also.
    ...collection.themes.map((item) => item.theme.title),
  ]
    .join(" ")
    .toLowerCase();

  // include: contains this text anywhere inside.
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
// Checks if there are any active filters to show clear filters or not
// ============================================================================
export function hasActiveCollectionFilters(filters: CollectionFilterState): boolean {
  return (
    filters.searchQuery.trim() !== "" ||
    filters.difficultyFilter !== "All" ||
    (filters.themeFilter !== "all" && filters.themeFilter.trim() !== "")
  );
}

// ============================================================================
// Builds the collection filter URL
// ============================================================================
export function buildCollectionFilterUrl(
  current: CollectionFilterState,
  filter: Partial<CollectionFilterState>,
): string {
  // Merge current filters with the next partial update.
  const merged: CollectionFilterState = {
    searchQuery: filter.searchQuery ?? current.searchQuery,
    difficultyFilter: filter.difficultyFilter ?? current.difficultyFilter,
    themeFilter: filter.themeFilter ?? current.themeFilter,
  };

  // URLSearchParams is a built-in helper to safely build query strings
  // like "q=fork&difficulty=Beginner" without manual string concatenation.
  const searchParams = new URLSearchParams();
  const q = merged.searchQuery.trim();

  // Keep the URL clean by writing only active (non-default) filters.
  if (q) searchParams.set("q", q);
  if (merged.difficultyFilter !== "All") searchParams.set("difficulty", merged.difficultyFilter);

  const theme = merged.themeFilter.trim();
  if (theme && theme !== "all") searchParams.set("theme", theme);

  // If no filters are active, return base path: /collection
  const query = searchParams.toString();
  return query ? `${COLLECTION_PAGE_PATH}?${query}` : COLLECTION_PAGE_PATH;
}
