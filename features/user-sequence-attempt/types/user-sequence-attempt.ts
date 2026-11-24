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
  /** Rating change this attempt applied to the profile; null when it applied none. */
  ratingDelta: number | null;
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

/** Totals for the attempt so far; missing values keep what is stored. */
export type SequenceAttemptCounters = {
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};

// ================================================================================================
// Saving an attempt: "started" records progress, "completed" / "failed" / "abandoned" finish it.
// ================================================================================================
export type SaveSequenceAttemptInput = SequenceAttemptCounters & {
  attemptId: string;
  sequenceId: string;
  status: PuzzleAttemptStatus;
};

export type SavedSequenceAttempt = {
  attempt: UserSequenceAttempt;
  /** Rating change this save applied; null when it applied none. */
  ratingDelta: number | null;
  /** The profile's rating after the save. */
  currentRating: number | null;
};

/** Error codes raised by the attempt write functions in the database. */
export type SequenceAttemptWriteError =
  | "sequence_not_found"
  | "attempt_not_found"
  | "attempt_sequence_mismatch"
  | "attempt_already_finished"
  | "invalid_attempt_counters"
  | "failed";

export type SequenceAttemptWriteResult<T> = { ok: true; value: T } | { ok: false; code: SequenceAttemptWriteError };
