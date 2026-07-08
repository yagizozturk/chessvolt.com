// TODO: Refactor
/** Matches Postgres enum `public.riddle_attempt_status`. */
export type RiddleAttemptStatus = "started" | "completed" | "abandoned" | "failed";

export const RIDDLE_ATTEMPT_STATUSES: RiddleAttemptStatus[] = [
  "started",
  "completed",
  "abandoned",
  "failed",
];

export function isRiddleAttemptStatus(value: string): value is RiddleAttemptStatus {
  return (RIDDLE_ATTEMPT_STATUSES as string[]).includes(value);
}
