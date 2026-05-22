import { apiClient } from "@/api-client/client";

import type { SequenceAttemptEventType } from "@/features/user-sequence-attempt-event/types/sequence-attempt-event-type";
import type { RiddleAttemptStatus } from "@/features/user-sequence-attempt/types/riddle-attempt-status";

export type StartSequenceAttemptResponse = {
  success: boolean;
  attemptId: string;
};

export type UpdateSequenceAttemptResponse = {
  success: boolean;
  attemptId: string;
};

export type RecordSequenceAttemptEventResponse = {
  success: boolean;
  eventId?: string;
};

export type UpdateSequenceAttemptPayload = {
  attemptId: string;
  status: RiddleAttemptStatus;
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};

export type RecordSequenceAttemptEventPayload = {
  eventType: SequenceAttemptEventType;
  moveUci?: string | null;
  expectedUci?: string | null;
  isCorrect?: boolean | null;
  hintLevel?: 1 | 2 | null;
  timeFromStartMs?: number | null;
};

export async function startSequenceAttempt(
  sequenceId: string,
): Promise<{ data: StartSequenceAttemptResponse }> {
  return await apiClient.post<{ data: StartSequenceAttemptResponse }>(
    `/move-sequence/${sequenceId}/attempt`,
    { status: "started" },
  );
}

export async function updateSequenceAttempt(
  sequenceId: string,
  data: UpdateSequenceAttemptPayload,
): Promise<{ data: UpdateSequenceAttemptResponse }> {
  return await apiClient.post<{ data: UpdateSequenceAttemptResponse }>(
    `/move-sequence/${sequenceId}/attempt`,
    data,
  );
}

export async function recordSequenceAttemptEvent(
  attemptId: string,
  data: RecordSequenceAttemptEventPayload,
): Promise<{ data: RecordSequenceAttemptEventResponse }> {
  return await apiClient.post<{ data: RecordSequenceAttemptEventResponse }>(
    `/user-sequence-attempt/${attemptId}/event`,
    data,
  );
}
