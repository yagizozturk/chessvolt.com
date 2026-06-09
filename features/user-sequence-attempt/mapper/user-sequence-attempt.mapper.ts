import type { RiddleAttemptStatus } from "@/features/user-sequence-attempt/types/riddle-attempt-status";
import { isRiddleAttemptStatus } from "@/features/user-sequence-attempt/types/riddle-attempt-status";
import type {
  SequenceAttemptStats,
  UserSequenceAttempt,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";

export type DbUserSequenceAttempt = {
  id: string;
  user_id: string;
  sequence_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  correct_move_count: number;
  wrong_move_count: number;
  hint_count: number;
  max_correct_streak: number;
  created_at: string;
  updated_at: string;
};

function toStatus(dbStatus: string): RiddleAttemptStatus {
  if (!isRiddleAttemptStatus(dbStatus)) {
    throw new Error(`Invalid riddle_attempt_status: ${dbStatus}`);
  }
  return dbStatus;
}

export function toUserSequenceAttempt(db: DbUserSequenceAttempt): UserSequenceAttempt {
  return {
    id: db.id,
    userId: db.user_id,
    sequenceId: db.sequence_id,
    status: toStatus(db.status),
    startedAt: db.started_at,
    completedAt: db.completed_at,
    durationMs: db.duration_ms,
    correctMoveCount: db.correct_move_count,
    wrongMoveCount: db.wrong_move_count,
    hintCount: db.hint_count,
    maxCorrectStreak: db.max_correct_streak,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function toSequenceAttemptStats(db: DbUserSequenceAttempt): SequenceAttemptStats {
  const status = toStatus(db.status);
  return {
    sequenceId: db.sequence_id,
    status,
    isCompleted: status === "completed",
    correctMoveCount: db.correct_move_count,
    wrongMoveCount: db.wrong_move_count,
    hintCount: db.hint_count,
    maxCorrectStreak: db.max_correct_streak,
    durationMs: db.duration_ms,
  };
}
