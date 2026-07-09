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
