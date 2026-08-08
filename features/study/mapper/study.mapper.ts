import { DEFAULT_STUDY_DIFFICULTY } from "@/features/study/constants/study-difficulty.constants";
import type { Study, StudyWithPuzzleCount } from "@/features/study/types/study";
import type { StudyDifficulty } from "@/features/study/types/study-difficulty";
import { parseStudyDifficulty } from "@/features/study/utilities/study-difficulty.utils";

// ============================================================================
// Row shape returned by Supabase `studies` queries (`select("*")`). Uses snake_case column names.
// ============================================================================
export type DbStudy = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  cover_image_color: string;
  difficulty: StudyDifficulty;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// Row shape when a study query embeds a puzzle count aggregate,
// e.g. `select("*, study_puzzles(count)")`.
// PostgREST returns the aggregate as an array with one object: `[{ count: N }]`.
// Moved here from the repository so DB shapes and mapping live in one place.
// ============================================================================
export type DbStudyWithPuzzleCount = DbStudy & {
  study_puzzles: [{ count: number }] | null;
};

// ============================================================================
// Maps a plain `studies` row to the domain `Study` (snake_case → camelCase, parsed enums).
// ============================================================================
export function toStudy(db: DbStudy): Study {
  return {
    id: db.id,
    title: db.title,
    slug: db.slug,
    description: db.description,
    coverImageUrl: db.cover_image_url,
    coverImageColor: db.cover_image_color,
    difficulty: parseStudyDifficulty(db.difficulty) ?? DEFAULT_STUDY_DIFFICULTY,
    sortOrder: db.sort_order,
    isActive: db.is_active,
    createdBy: db.created_by,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// ============================================================================
// Maps a study row that includes `study_puzzles(count)` to `StudyWithPuzzleCount`.
// Reads the aggregate count from `study_puzzles[0].count`, defaulting to 0 when missing.
// Shared by study repository queries and extended by `toStudyWithPuzzleCountAndThemes`.
// ============================================================================
export function toStudyWithPuzzleCount(db: DbStudyWithPuzzleCount): StudyWithPuzzleCount {
  const puzzleCount = db.study_puzzles?.[0]?.count ?? 0;
  return { ...toStudy(db), puzzleCount };
}
