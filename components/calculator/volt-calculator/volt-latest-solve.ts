import { computeDayVoltFromScores } from "@/components/calculator/volt-calculator/compute-volt";
import type {
  VoltAttemptBreakdown,
  VoltDaySlot,
  VoltScoreResult,
} from "@/components/calculator/volt-calculator/volt.types";

export type LatestVoltAttempt = {
  attempt: VoltAttemptBreakdown;
  day: VoltDaySlot;
};

/** The most recent solve across all scored days (by startedAt). */
export function findLatestVoltAttempt(result: VoltScoreResult): LatestVoltAttempt | null {
  let latest: LatestVoltAttempt | null = null;

  for (const day of result.days) {
    for (const attempt of day.attempts) {
      if (!latest || new Date(attempt.startedAt).getTime() > new Date(latest.attempt.startedAt).getTime()) {
        latest = { attempt, day };
      }
    }
  }

  return latest;
}

export type LatestSolveCharge = {
  /** Calendar day (YYYY-MM-DD) of the latest solve. */
  date: string;
  /** That day's Volt before the latest solve. */
  previousDayVolt: number;
  /** That day's Volt including the latest solve. */
  dayVolt: number;
  dayMaxVolt: number;
  /** Total Volt before the latest solve (see note on dropped days below). */
  previousVolt: number;
};

/**
 * How the latest solve changed its day: recompute the day without that solve.
 *
 * Note: if the solve opened a brand-new day that pushed the oldest scored day out of the
 * window, `previousVolt` does not include that dropped day (it is no longer in `result`).
 */
export function getLatestSolveCharge(result: VoltScoreResult): LatestSolveCharge | null {
  const latest = findLatestVoltAttempt(result);
  if (!latest) {
    return null;
  }

  const { attempt, day } = latest;
  if (!day.date) {
    return null;
  }

  const otherScores = day.attempts.filter((row) => row.attemptId !== attempt.attemptId).map((row) => row.attemptScore);
  const previousDayVolt = Math.min(day.dayVolt, computeDayVoltFromScores(otherScores, day.dayMaxVolt));

  return {
    date: day.date,
    previousDayVolt,
    dayVolt: day.dayVolt,
    dayMaxVolt: day.dayMaxVolt,
    previousVolt: Math.max(0, result.volt - (day.dayVolt - previousDayVolt)),
  };
}
