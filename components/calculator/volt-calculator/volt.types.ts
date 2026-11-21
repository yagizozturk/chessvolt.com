export type VoltAttemptBreakdown = {
  attemptId: string;
  /** 1-based chronological order within the day. */
  attemptIndex: number;
  /** 1-based rank by attemptScore within the day (1 = best). */
  rank: number;
  /** True when this solve is one of the day's best solves that contribute Volt. */
  isCounted: boolean;
  startedAt: string;
  accuracyPercent: number;
  timingPercent: number;
  streakPercent: number;
  attemptScore: number;
  /** 0 when the solve is not among the day's best. */
  attemptWeight: number;
  weightedContribution: number;
};

export type VoltDaySlot = {
  slotIndex: number;
  date: string | null;
  dayVolt: number;
  dayMaxVolt: number;
  isPlayed: boolean;
  /** Every completed solve that day, chronological. */
  attempts: VoltAttemptBreakdown[];
};

export type VoltScoreResult = {
  volt: number;
  maxVolt: number;
  lookbackMonths: number;
  scoredDayCount: number;
  /** How many of a day's best solves count (e.g. 3). */
  bestAttemptsCounted: number;
  days: VoltDaySlot[];
};
