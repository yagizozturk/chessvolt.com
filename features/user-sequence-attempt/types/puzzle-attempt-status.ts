/** Matches Postgres enum `public.puzzle_attempt_status`. */
export type PuzzleAttemptStatus = "started" | "completed" | "abandoned" | "failed";

export const PUZZLE_ATTEMPT_STATUSES: PuzzleAttemptStatus[] = ["started", "completed", "abandoned", "failed"];

export function isPuzzleAttemptStatus(value: string): value is PuzzleAttemptStatus {
  return (PUZZLE_ATTEMPT_STATUSES as string[]).includes(value);
}
