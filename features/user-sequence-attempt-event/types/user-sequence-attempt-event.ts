import type { SequenceAttemptEventType } from "@/features/user-sequence-attempt-event/types/sequence-attempt-event-type";

export type UserSequenceAttemptEvent = {
  id: string;
  attemptId: string;
  eventType: SequenceAttemptEventType;
  moveUci: string | null;
  expectedUci: string | null;
  isCorrect: boolean | null;
  hintLevel: 1 | 2 | 3 | null;
  timeFromStartMs: number | null;
  createdAt: string;
};

export type CreateUserSequenceAttemptEventInput = {
  attemptId: string;
  eventType: SequenceAttemptEventType;
  moveUci?: string | null;
  expectedUci?: string | null;
  isCorrect?: boolean | null;
  hintLevel?: 1 | 2 | 3 | null;
  timeFromStartMs?: number | null;
};
