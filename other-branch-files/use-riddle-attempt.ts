"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  type RecordRiddleAttemptEventPayload,
  type UpdateRiddleAttemptPayload,
  recordRiddleAttemptEvent,
  startRiddleAttempt,
  updateRiddleAttempt,
} from "@/features/riddle/api/riddle";
import type { RiddleAttemptStatus } from "@/features/riddle/types/user-riddle";

type AttemptCounters = Omit<UpdateRiddleAttemptPayload, "attemptId" | "status">;

const TERMINAL_STATUSES: RiddleAttemptStatus[] = ["completed", "failed", "abandoned"];

export function useRiddleAttempt(riddleId: string) {
  const attemptIdRef = useRef<string | null>(null);
  const startPromiseRef = useRef<Promise<string | null> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    attemptIdRef.current = null;
    startedAtRef.current = null;
    startPromiseRef.current = null;
  }, [riddleId]);

  // ============================================================================
  // Riddle attempt id'yi döner.
  // ============================================================================
  const getAttemptId = useCallback(() => attemptIdRef.current, []);

  // ============================================================================
  // Riddle attempt başlangıçtan itibaren geçen süreyi hesaplar.
  // ============================================================================
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
          const { data } = await startRiddleAttempt(riddleId);
          attemptIdRef.current = data.attemptId;
          startedAtRef.current = Date.now();

          await recordRiddleAttemptEvent(data.attemptId, { eventType: "start" });

          return data.attemptId;
        } catch (err) {
          startPromiseRef.current = null;
          setError(err instanceof Error ? err.message : "Failed to start riddle attempt");
          return null;
        } finally {
          setIsLoading(false);
        }
      })();
    }

    return startPromiseRef.current;
  }, [riddleId]);

  // ============================================================================
  // Riddle attempt status'u güncellenir.
  // ============================================================================
  const updateAttemptStatus = useCallback(
    async (status: RiddleAttemptStatus, counters?: AttemptCounters) => {
      const attemptId = await ensureAttemptStarted();
      if (!attemptId) return;

      setIsLoading(true);
      setError(null);

      const durationMs = TERMINAL_STATUSES.includes(status) ? getTimeFromStartMs() : undefined;

      try {
        await updateRiddleAttempt(riddleId, {
          attemptId,
          status,
          ...(durationMs != null ? { durationMs } : {}),
          ...counters,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update riddle attempt");
      } finally {
        setIsLoading(false);
      }
    },
    [ensureAttemptStarted, getTimeFromStartMs, riddleId],
  );

  // ============================================================================
  // Riddle attempt event'i kaydedilir.
  // ============================================================================
  const recordEvent = useCallback(
    async (payload: RecordRiddleAttemptEventPayload) => {
      const attemptId = await ensureAttemptStarted();
      if (!attemptId) return;

      try {
        await recordRiddleAttemptEvent(attemptId, {
          ...payload,
          timeFromStartMs: payload.timeFromStartMs ?? getTimeFromStartMs(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to record riddle event");
      }
    },
    [ensureAttemptStarted, getTimeFromStartMs],
  );

  // ============================================================================
  // Riddle attempt hook'u döner.
  // ============================================================================
  return {
    getAttemptId,
    ensureAttemptStarted,
    updateAttemptStatus,
    recordEvent,
    isLoading,
    error,
  };
}
