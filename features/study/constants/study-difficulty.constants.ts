import type { StudyDifficulty } from "@/features/study/types/study-difficulty";

// ============================================================================
// Fallback when difficulty is missing or invalid (mapper, repository create).
// ============================================================================
export const DEFAULT_STUDY_DIFFICULTY: StudyDifficulty = 4;

// ============================================================================
// All valid difficulty values — used by difficulty select UI.
// ============================================================================
export const STUDY_DIFFICULTY_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const satisfies readonly StudyDifficulty[];
