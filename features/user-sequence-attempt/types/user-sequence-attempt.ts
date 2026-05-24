import type { RiddleAttemptStatus } from "@/features/user-sequence-attempt/types/riddle-attempt-status";

export type UserSequenceAttempt = {
  id: string;
  userId: string;
  sequenceId: string;
  status: RiddleAttemptStatus;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  correctMoveCount: number;
  wrongMoveCount: number;
  hintCount: number;
  maxCorrectStreak: number;
  createdAt: string;
  updatedAt: string;
};

/** Latest attempt summary per sequence (e.g. challenge progress). */
export type SequenceAttemptSummary = {
  sequenceId: string;
  status: RiddleAttemptStatus;
  isCompleted: boolean;
  correctMoveCount: number;
  wrongMoveCount: number;
  hintCount: number;
  maxCorrectStreak: number;
  durationMs: number | null;
};

/** Board list cards: completion badge + optional accuracy. */
export type SequenceAttemptBoardStats = {
  isComplete?: boolean;
  accuracyPercent: number | null;
};

export type CreateUserSequenceAttemptInput = {
  userId: string;
  sequenceId: string;
  status?: RiddleAttemptStatus;
  startedAt?: string;
  completedAt?: string | null;
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};

export type UpdateUserSequenceAttemptInput = {
  status?: RiddleAttemptStatus;
  completedAt?: string | null;
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};
