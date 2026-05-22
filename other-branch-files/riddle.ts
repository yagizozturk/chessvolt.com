import { apiClient } from "@/api-client/client";

import type { RiddleAttemptStatus } from "@/features/riddle/types/user-riddle";
import type { RiddleEventType, RiddleHintLevel } from "@/features/riddle/types/user-riddle-attempt-event";

export type StartRiddleAttemptResponse = {
  success: boolean;
  attemptId: string;
};

export type UpdateRiddleAttemptResponse = {
  success: boolean;
  attemptId: string;
};

export type RecordRiddleAttemptEventResponse = {
  success: boolean;
  eventId?: string;
};

export type UpdateRiddleAttemptPayload = {
  attemptId: string;
  status: RiddleAttemptStatus;
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};

export type RecordRiddleAttemptEventPayload = {
  eventType: RiddleEventType;
  moveUci?: string | null;
  expectedUci?: string | null;
  isCorrect?: boolean | null;
  hintLevel?: RiddleHintLevel | null;
  timeFromStartMs?: number | null;
};

export async function startRiddleAttempt(
  riddleId: string,
): Promise<{ data: StartRiddleAttemptResponse }> {
  return await apiClient.post<{ data: StartRiddleAttemptResponse }>(`/riddle/${riddleId}/solve`, {
    status: "started",
  });
}

export async function updateRiddleAttempt(
  riddleId: string,
  data: UpdateRiddleAttemptPayload,
): Promise<{ data: UpdateRiddleAttemptResponse }> {
  return await apiClient.post<{ data: UpdateRiddleAttemptResponse }>(`/riddle/${riddleId}/solve`, data);
}

export async function recordRiddleAttemptEvent(
  attemptId: string,
  data: RecordRiddleAttemptEventPayload,
): Promise<{ data: RecordRiddleAttemptEventResponse }> {
  return await apiClient.post<{ data: RecordRiddleAttemptEventResponse }>(
    `/riddle/attempt/${attemptId}/event`,
    data,
  );
}
