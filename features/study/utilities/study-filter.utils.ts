import type { StudyWithRiddleCountAndThemes } from "@/features/study/types/study";
import type { StudyDifficulty } from "@/features/study/types/study-difficulty";
import {
  STUDY_DIFFICULTY_OPTIONS,
  type StudyDifficultyOptions,
  type StudyFilterState,
} from "@/features/study/types/study-filter";
import type { Theme } from "@/features/theme/types/theme";

const STUDY_PAGE_PATH = "/study";

// ============================================================================
// Gets the theme options for filter
// Multiple studies can share the same theme. When you loop every study’s
// themes, slug can show up many times. The Map keeps each theme once
// so the dropdown doesn’t list duplicates.
// ============================================================================
export function getThemeFilterOptions(studies: StudyWithRiddleCountAndThemes[]): Theme[] {
  const themesBySlug = new Map<string, Theme>();

  for (const study of studies) {
    for (const { theme } of study.themes) {
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
export function parseStudyFilterStateFromUrl(params: {
  difficulty?: string;
  theme?: string;
  q?: string;
}): StudyFilterState {
  const difficultyParam = params.difficulty?.trim() ?? "";
  const difficultyFilter = STUDY_DIFFICULTY_OPTIONS.includes(difficultyParam as StudyDifficultyOptions)
    ? (difficultyParam as StudyDifficultyOptions)
    : "All";
  const themeFilter = params.theme?.trim() || "all";
  const searchQuery = params.q?.trim() ?? "";

  return { searchQuery, difficultyFilter, themeFilter };
}

// ============================================================================
// Matches the difficulty option to the difficulty LEVEL
// ============================================================================
function matchesDifficultyOption(difficulty: StudyDifficulty, option: StudyDifficultyOptions): boolean {
  if (option === "All") return true;
  if (option === "Beginner") return difficulty <= 2;
  if (option === "Intermediate") return difficulty >= 3 && difficulty <= 4;
  if (option === "Advanced") return difficulty >= 5 && difficulty <= 6;
  if (option === "Master") return difficulty >= 7 && difficulty <= 8;
  return difficulty >= 9;
}

// ============================================================================
// Matches the search query to the study
// Searching for title, description and even themes
// ============================================================================
function matchesSearchQuery(study: StudyWithRiddleCountAndThemes, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const searchableText = [
    study.title,
    study.description,
    // ... spread operator: it takes each theme title from the mapped array and inserts them
    // as separate items into searchableText array. So it looks for theme names also.
    ...study.themes.map((item) => item.theme.title),
  ]
    .join(" ")
    .toLowerCase();

  // include: contains this text anywhere inside.
  return searchableText.includes(normalizedQuery);
}

// ============================================================================
// Filters the studies
// ============================================================================
export function filterStudies(
  studies: StudyWithRiddleCountAndThemes[],
  filters: StudyFilterState,
): StudyWithRiddleCountAndThemes[] {
  // e.g. "all" (no theme filter), "" (same as no filter), or a theme slug like "tactics" | "endgames"
  const themeSlug = filters.themeFilter.trim();

  // e.g. [{ id: "…", title: "Italian Opening", difficulty: 2, riddleCount: 12, themes: [...] }] or [] when nothing matches
  return studies.filter((study) => {
    const matchesSearch = matchesSearchQuery(study, filters.searchQuery);
    const matchesDifficulty = matchesDifficultyOption(study.difficulty, filters.difficultyFilter);
    const matchesTheme =
      themeSlug === "all" || themeSlug === "" || study.themes.some((item) => item.theme.slug === themeSlug);

    // Per study: true keeps it, false drops it (e.g. true when search="italian", difficultyFilter="Beginner", themeSlug="all" all match)
    return matchesSearch && matchesDifficulty && matchesTheme;
  });
}

// ============================================================================
// Checks if there are any active filters to show clear filters or not
// ============================================================================
export function hasActiveStudyFilters(filters: StudyFilterState): boolean {
  return (
    filters.searchQuery.trim() !== "" ||
    filters.difficultyFilter !== "All" ||
    (filters.themeFilter !== "all" && filters.themeFilter.trim() !== "")
  );
}

// ============================================================================
// Builds the study filter URL
// ============================================================================
export function buildStudyFilterUrl(
  current: StudyFilterState,
  filter: Partial<StudyFilterState>,
): string {
  // Merge current filters with the next partial update.
  const merged: StudyFilterState = {
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

  // If no filters are active, return base path: /study
  const query = searchParams.toString();
  return query ? `${STUDY_PAGE_PATH}?${query}` : STUDY_PAGE_PATH;
}
