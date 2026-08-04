export const STUDY_DIFFICULTY_OPTIONS = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Master",
  "Grandmaster",
] as const;

export type StudyDifficultyOptions = (typeof STUDY_DIFFICULTY_OPTIONS)[number];

// ============================================================================
// Study filter state
// StudyFilterState is differnet and not in types folder.
// It’s temporary client state for one list (searchQuery, difficultyFilter, themeFilter).
// Nothing is persisted; it only exists while filtering.
// ============================================================================
export type StudyFilterState = {
  searchQuery: string;
  difficultyFilter: StudyDifficultyOptions;
  themeFilter: string;
};
