// TODO: Refactor
import type { StudyRiddle } from "@/features/study-riddles/types/study-riddle";

export type DbStudyRiddle = {
  id: string;
  riddle_id: string;
  study_id: string;
  sort_order: number;
  created_at: string;
};

export function toStudyRiddle(db: DbStudyRiddle): StudyRiddle {
  return {
    id: db.id,
    riddleId: db.riddle_id,
    studyId: db.study_id,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
  };
}
