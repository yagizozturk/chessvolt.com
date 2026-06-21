import { computeVoltAccuracy } from "@/components/calculator/accuracy-calculator/compute-volt-accuracy";
import { computeRatingTimingPercent } from "@/components/calculator/rating-timing-calculator/compute-rating-timing";
import { computeStreakPercent } from "@/components/calculator/streak-calculator/compute-streak";
import { VOLT_CONFIG } from "@/components/calculator/volt-calculator/volt.config";
import type {
  VoltAttemptBreakdown,
  VoltDaySlot,
  VoltScoreResult,
} from "@/components/calculator/volt-calculator/volt.types";

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

function toCalendarDayKey(iso: string): string {
  return iso.slice(0, 10);
}

function getLookbackStart(now: Date, lookbackMonths: number): Date {
  const start = new Date(now);
  start.setMonth(start.getMonth() - lookbackMonths);
  return start;
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
    attemptScore: Math.round(attemptScore * 100) / 100,
  };
}

function computeDayVolt(
  attempts: VoltAttemptRecord[],
  totalMoveCount: number,
  rating: number,
): {
  dayVolt: number;
  attempts: VoltAttemptBreakdown[];
} {
  const weights = VOLT_CONFIG.attemptSlotWeights;
  const slots = VOLT_CONFIG.attemptsPerDayCounted;
  const sorted = [...attempts].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
  const counted = sorted.slice(0, slots);

  const breakdowns: VoltAttemptBreakdown[] = counted.map((attempt, index) => {
    const scores = computeAttemptScore(attempt, totalMoveCount, rating);
    const attemptWeight = weights[index] ?? 0;
    const weightedContribution = scores.attemptScore * attemptWeight;

    return {
      attemptId: attempt.id,
      attemptIndex: index + 1,
      startedAt: attempt.startedAt,
      ...scores,
      attemptWeight,
      weightedContribution: Math.round(weightedContribution * 100) / 100,
    };
  });

  const rawDayScore = breakdowns.reduce((sum, row) => sum + row.weightedContribution, 0);
  const dayVolt = Math.round(Math.min(VOLT_CONFIG.dayMaxVolt, (rawDayScore * VOLT_CONFIG.dayMaxVolt) / 100));

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
  const lookbackStart = getLookbackStart(now, lookbackMonths);
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
    attemptsPerDayCounted: VOLT_CONFIG.attemptsPerDayCounted,
    days,
  };
}
