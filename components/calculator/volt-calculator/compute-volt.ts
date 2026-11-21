import { computeVoltAccuracy } from "@/components/calculator/accuracy-calculator/compute-volt-accuracy";
import { computeRatingTimingPercent } from "@/components/calculator/rating-timing-calculator/compute-rating-timing";
import { computeStreakPercent } from "@/components/calculator/streak-calculator/compute-streak";
import {
  VOLT_CONFIG,
  getBestAttemptsCounted,
  getVoltLookbackStart,
} from "@/components/calculator/volt-calculator/volt.config";
import type {
  VoltAttemptBreakdown,
  VoltDaySlot,
  VoltScoreResult,
} from "@/components/calculator/volt-calculator/volt.types";

/** A completed solve. Callers must pass only completed attempts (see `isVoltCountedAttempt`). */
export type VoltAttemptRecord = {
  id: string;
  startedAt: string;
  durationMs: number | null;
  correctMoveCount: number;
  wrongMoveCount: number;
  hintCount: number;
  maxCorrectStreak: number;
};

export type ComputeVoltInput = {
  attempts: VoltAttemptRecord[];
  totalMoveCount: number;
  rating: number;
  lookbackMonths?: number;
  scoredDayCount?: number;
  now?: Date;
};

type ScoredAttempt = Pick<
  VoltAttemptBreakdown,
  "accuracyPercent" | "timingPercent" | "streakPercent" | "attemptScore"
> & {
  attempt: VoltAttemptRecord;
  attemptIndex: number;
};

function toCalendarDayKey(iso: string): string {
  return iso.slice(0, 10);
}

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

function computeAttemptScore(
  attempt: VoltAttemptRecord,
  totalMoveCount: number,
  rating: number,
): Pick<VoltAttemptBreakdown, "accuracyPercent" | "timingPercent" | "streakPercent" | "attemptScore"> {
  const accuracyPercent = computeVoltAccuracy({
    wrongMoveCount: attempt.wrongMoveCount,
    hintCount: attempt.hintCount,
    totalMoveCount,
  });

  const timingPercent = computeRatingTimingPercent({
    rating,
    durationMs: attempt.durationMs,
  });

  const streakPercent = computeStreakPercent({
    maxCorrectStreak: attempt.maxCorrectStreak,
    totalMoveCount,
  });

  const { accuracy, timing, streak } = VOLT_CONFIG.metricWeights;

  const attemptScore = accuracyPercent * accuracy + timingPercent * timing + streakPercent * streak;

  return {
    accuracyPercent,
    timingPercent,
    streakPercent,
    attemptScore: roundTo2(attemptScore),
  };
}

/**
 * Day Volt from a day's attempt scores (any order): the best N are weighted by
 * VOLT_CONFIG.bestAttemptWeights, then scaled to dayMaxVolt. Shared by the server
 * calculation and the client "before this solve" charge animation.
 */
export function computeDayVoltFromScores(scores: number[], dayMaxVolt: number = VOLT_CONFIG.dayMaxVolt): number {
  const weights = VOLT_CONFIG.bestAttemptWeights;
  const rawDayScore = [...scores]
    .sort((a, b) => b - a)
    .slice(0, weights.length)
    .reduce((sum, score, index) => sum + roundTo2(score * (weights[index] ?? 0)), 0);

  return Math.round(Math.min(dayMaxVolt, (rawDayScore * dayMaxVolt) / 100));
}

/** Best score first; ties go to the earlier solve so ranks are stable. */
function compareByScoreDesc(a: ScoredAttempt, b: ScoredAttempt): number {
  if (b.attemptScore !== a.attemptScore) {
    return b.attemptScore - a.attemptScore;
  }
  return a.attemptIndex - b.attemptIndex;
}

// ================================================================================================
// A day's Volt: every solve is scored, then the best N (by attemptScore) are weighted
// 50% / 30% / 20% (VOLT_CONFIG.bestAttemptWeights). Remaining solves are kept in the
// breakdown with weight 0 so the UI can still show them ("Solved 5 times").
// ================================================================================================
function computeDayVolt(
  attempts: VoltAttemptRecord[],
  totalMoveCount: number,
  rating: number,
): {
  dayVolt: number;
  attempts: VoltAttemptBreakdown[];
} {
  const weights = VOLT_CONFIG.bestAttemptWeights;
  const countedLimit = getBestAttemptsCounted();

  const chronological: ScoredAttempt[] = [...attempts]
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .map((attempt, index) => ({
      attempt,
      attemptIndex: index + 1,
      ...computeAttemptScore(attempt, totalMoveCount, rating),
    }));

  const rankById = new Map(
    [...chronological].sort(compareByScoreDesc).map((scored, index) => [scored.attempt.id, index + 1]),
  );

  const breakdowns: VoltAttemptBreakdown[] = chronological.map(({ attempt, attemptIndex, ...scores }) => {
    const rank = rankById.get(attempt.id) ?? chronological.length;
    const isCounted = rank <= countedLimit;
    const attemptWeight = isCounted ? (weights[rank - 1] ?? 0) : 0;

    return {
      attemptId: attempt.id,
      attemptIndex,
      rank,
      isCounted,
      startedAt: attempt.startedAt,
      ...scores,
      attemptWeight,
      weightedContribution: roundTo2(scores.attemptScore * attemptWeight),
    };
  });

  const dayVolt = computeDayVoltFromScores(chronological.map((scored) => scored.attemptScore));

  return { dayVolt, attempts: breakdowns };
}

function groupAttemptsByDay(attempts: VoltAttemptRecord[], lookbackStart: Date): Map<string, VoltAttemptRecord[]> {
  const byDay = new Map<string, VoltAttemptRecord[]>();

  for (const attempt of attempts) {
    const started = new Date(attempt.startedAt);
    if (started < lookbackStart) {
      continue;
    }

    const key = toCalendarDayKey(attempt.startedAt);
    const list = byDay.get(key) ?? [];
    list.push(attempt);
    byDay.set(key, list);
  }

  return byDay;
}

function buildEmptySlot(slotIndex: number): VoltDaySlot {
  return {
    slotIndex,
    date: null,
    dayVolt: 0,
    dayMaxVolt: VOLT_CONFIG.dayMaxVolt,
    isPlayed: false,
    attempts: [],
  };
}

export function computeVoltScore({
  attempts,
  totalMoveCount,
  rating,
  lookbackMonths = VOLT_CONFIG.lookbackMonths,
  scoredDayCount = VOLT_CONFIG.scoredDayCount,
  now = new Date(),
}: ComputeVoltInput): VoltScoreResult {
  const lookbackStart = getVoltLookbackStart(now, lookbackMonths);
  const byDay = groupAttemptsByDay(attempts, lookbackStart);

  const playedDayKeys = [...byDay.keys()].sort((a, b) => b.localeCompare(a));
  const selectedDays = playedDayKeys.slice(0, scoredDayCount);

  const playedSlots: VoltDaySlot[] = selectedDays.map((date, index) => {
    const dayAttempts = byDay.get(date) ?? [];
    const { dayVolt, attempts: breakdowns } = computeDayVolt(dayAttempts, totalMoveCount, rating);

    return {
      slotIndex: index + 1,
      date,
      dayVolt,
      dayMaxVolt: VOLT_CONFIG.dayMaxVolt,
      isPlayed: true,
      attempts: breakdowns,
    };
  });

  const paddingCount = Math.max(0, scoredDayCount - playedSlots.length);
  const paddingSlots = Array.from({ length: paddingCount }, (_, i) => buildEmptySlot(playedSlots.length + i + 1));

  const days = [...playedSlots, ...paddingSlots];
  const volt = days.reduce((sum, day) => sum + day.dayVolt, 0);
  const maxVolt = scoredDayCount * VOLT_CONFIG.dayMaxVolt;

  return {
    volt,
    maxVolt,
    lookbackMonths,
    scoredDayCount,
    bestAttemptsCounted: getBestAttemptsCounted(),
    days,
  };
}
