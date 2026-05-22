/** Matches Postgres enum `public.sequence_attempt_event_type`. */
export type SequenceAttemptEventType =
  | "attempt_started"
  | "move_played"
  | "hint_used"
  | "attempt_completed"
  | "attempt_abandoned";

export const SEQUENCE_ATTEMPT_EVENT_TYPES: SequenceAttemptEventType[] = [
  "attempt_started",
  "move_played",
  "hint_used",
  "attempt_completed",
  "attempt_abandoned",
];

export function isSequenceAttemptEventType(value: string): value is SequenceAttemptEventType {
  return (SEQUENCE_ATTEMPT_EVENT_TYPES as string[]).includes(value);
}

export function isHintLevel(value: number | null | undefined): value is 1 | 2 {
  return value === 1 || value === 2;
}
