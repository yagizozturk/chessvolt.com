import type { StudyPuzzle } from "@/features/study-puzzles/types/study-puzzle";

export type DbStudyPuzzle = {
  id: string;
  puzzle_id: string;
  study_id: string;
  sort_order: number;
  created_at: string;
};

export function toStudyPuzzle(db: DbStudyPuzzle): StudyPuzzle {
  return {
    id: db.id,
    puzzleId: db.puzzle_id,
    studyId: db.study_id,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
  };
}
