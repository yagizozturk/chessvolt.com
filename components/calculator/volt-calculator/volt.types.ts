export type VoltAttemptBreakdown = {
  attemptId: string;
  attemptIndex: number;
  startedAt: string;
  accuracyPercent: number;
  timingPercent: number;
  streakPercent: number;
  attemptScore: number;
  attemptWeight: number;
  weightedContribution: number;
};

export type VoltDaySlot = {
  slotIndex: number;
  date: string | null;
  dayVolt: number;
  dayMaxVolt: number;
  isPlayed: boolean;
  attempts: VoltAttemptBreakdown[];
};

export type VoltScoreResult = {
  volt: number;
  maxVolt: number;
  lookbackMonths: number;
  scoredDayCount: number;
  attemptsPerDayCounted: number;
  days: VoltDaySlot[];
};
