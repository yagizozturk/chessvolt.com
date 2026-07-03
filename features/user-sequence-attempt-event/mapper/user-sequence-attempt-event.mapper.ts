import {
  isHintLevel,
  isSequenceAttemptEventType,
} from "@/features/user-sequence-attempt-event/types/sequence-attempt-event-type";
import type { UserSequenceAttemptEvent } from "@/features/user-sequence-attempt-event/types/user-sequence-attempt-event";

export type DbUserSequenceAttemptEvent = {
  id: string;
  attempt_id: string;
  event_type: string;
  move_uci: string | null;
  expected_uci: string | null;
  is_correct: boolean | null;
  hint_level: number | null;
  time_from_start_ms: number | null;
  created_at: string;
};

function toEventType(dbType: string) {
  if (!isSequenceAttemptEventType(dbType)) {
    throw new Error(`Invalid sequence_attempt_event_type: ${dbType}`);
  }
  return dbType;
}

function toHintLevel(value: number | null): 1 | 2 | 3 | null {
  if (value == null) return null;
  if (!isHintLevel(value)) {
    throw new Error(`Invalid hint_level: ${value} (must be 1, 2, or 3)`);
  }
  return value;
}

export function toUserSequenceAttemptEvent(db: DbUserSequenceAttemptEvent): UserSequenceAttemptEvent {
  return {
    id: db.id,
    attemptId: db.attempt_id,
    eventType: toEventType(db.event_type),
    moveUci: db.move_uci,
    expectedUci: db.expected_uci,
    isCorrect: db.is_correct,
    hintLevel: toHintLevel(db.hint_level),
    timeFromStartMs: db.time_from_start_ms,
    createdAt: db.created_at,
  };
}
