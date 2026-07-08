// TODO: Refactor
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import {
  type RecordSequenceAttemptEventPayload,
  type UpdateSequenceAttemptPayload,
  recordSequenceAttemptEvent,
  startSequenceAttempt,
  updateSequenceAttempt,
} from "@/features/user-sequence-attempt/api/sequence-attempt";
import type { RiddleAttemptStatus } from "@/features/user-sequence-attempt/types/riddle-attempt-status";

type AttemptCounters = Omit<UpdateSequenceAttemptPayload, "attemptId" | "status">;

export function useSequenceAttempt(sequenceId: string, replayKey = 0) {
  const attemptIdRef = useRef<string | null>(null);
  const startPromiseRef = useRef<Promise<string | null> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    attemptIdRef.current = null;
    startPromiseRef.current = null;
    startedAtRef.current = Date.now();
  }, [replayKey, sequenceId]);

  const getAttemptId = useCallback(() => attemptIdRef.current, []);

  const getTimeFromStartMs = useCallback(() => {
    if (startedAtRef.current == null) return null;
    return Date.now() - startedAtRef.current;
  }, []);

  /** Creates the attempt row on first user action (move, hint, etc.), not on page load. */
  const ensureAttemptStarted = useCallback(async (): Promise<string | null> => {
    if (attemptIdRef.current) return attemptIdRef.current;

    if (!startPromiseRef.current) {
      startPromiseRef.current = (async () => {
        setIsLoading(true);
        setError(null);

        try {
          const { data } = await startSequenceAttempt(sequenceId);
          attemptIdRef.current = data.attemptId;

          await recordSequenceAttemptEvent(data.attemptId, {
            eventType: "start",
          });

          return data.attemptId;
        } catch (err) {
          startPromiseRef.current = null;
          setError(err instanceof Error ? err.message : "Failed to start sequence attempt");
          return null;
        } finally {
          setIsLoading(false);
        }
      })();
    }

    return startPromiseRef.current;
  }, [sequenceId]);

  const updateAttemptResults = useCallback(
    async (status: RiddleAttemptStatus, counters?: AttemptCounters): Promise<VoltScoreResult | null> => {
      const attemptId = await ensureAttemptStarted();
      if (!attemptId) return null;

      setIsLoading(true);
      setError(null);

      try {
        const { data } = await updateSequenceAttempt(sequenceId, {
          attemptId,
          status,
          ...counters,
        });

        return data.voltScore ?? null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update sequence attempt");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [ensureAttemptStarted, sequenceId],
  );

  const recordEvent = useCallback(
    async (payload: RecordSequenceAttemptEventPayload) => {
      const attemptId = await ensureAttemptStarted();
      if (!attemptId) return;

      try {
        await recordSequenceAttemptEvent(attemptId, {
          ...payload,
          timeFromStartMs: payload.timeFromStartMs ?? getTimeFromStartMs(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to record sequence event");
      }
    },
    [ensureAttemptStarted, getTimeFromStartMs],
  );

  return {
    getAttemptId,
    getTimeFromStartMs,
    ensureAttemptStarted,
    updateAttemptResults,
    recordEvent,
    isLoading,
    error,
  };
}
