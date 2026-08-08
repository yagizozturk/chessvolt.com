import type { PuzzleAttemptStatus } from "@/features/user-sequence-attempt/types/puzzle-attempt-status";

export type UserSequenceAttempt = {
  id: string;
  userId: string;
  sequenceId: string;
  status: PuzzleAttemptStatus;
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

// ================================================================================================
// Attempt stats per sequence (e.g. study progress).
// ================================================================================================
export type SequenceAttemptStats = {
  sequenceId: string;
  status: PuzzleAttemptStatus;
  isCompleted: boolean;
  correctMoveCount: number;
  wrongMoveCount: number;
  hintCount: number;
  maxCorrectStreak: number;
  durationMs: number | null;
};

export type SequenceAttemptData = {
  accuracyPercent: number | null;
};

export type CreateUserSequenceAttemptInput = {
  userId: string;
  sequenceId: string;
  status?: PuzzleAttemptStatus;
  startedAt?: string;
  completedAt?: string | null;
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};

export type UpdateUserSequenceAttemptInput = {
  status?: PuzzleAttemptStatus;
  completedAt?: string | null;
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};
