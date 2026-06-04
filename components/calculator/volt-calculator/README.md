# Volt calculator

Aggregates a user’s **historical attempts** on one riddle or opening variant into a single **Volt** score (e.g. **400/700 Volt**), with a per-day breakdown for detail views.

Volt composes the three sub-calculators: **accuracy**, **rating–timing**, and **streak**.

## Files

| File | Role |
|------|------|
| `volt.config.ts` | Lookback, day count, weights |
| `volt.types.ts` | `VoltScoreResult`, day/attempt breakdown types |
| `compute-volt.ts` | Core aggregation logic |
| `build-volt-score.ts` | Maps `UserSequenceAttempt[]` → score |
| `volt-calculator.tsx` | UI: total + expandable day breakdown |

## Scope

- **One move sequence** = one riddle or one opening variant (`sequenceId`).
- **Logged-in user** only; guests get `result: null`.
- Data source: `user_sequence_attempt` rows (`getAttemptsByUserAndSequence`).

## Config (`VOLT_CONFIG`)

| Key | Default | Meaning |
|-----|---------|---------|
| `lookbackMonths` | `3` | Only attempts with `startedAt` in this window |
| `scoredDayCount` | `7` | Always **7 slots** in the sum |
| `dayMaxVolt` | `100` | Max points per played day |
| `attemptsPerDayCounted` | `3` | 1st–3rd tries per day; **4th+ ignored** |
| `attemptSlotWeights` | `[0.6, 0.25, 0.15]` | Per-try weights within a day (**no renormalization**) |
| `metricWeights.accuracy` | `0.6` | Per-attempt composite |
| `metricWeights.timing` | `0.3` | Per-attempt composite |
| `metricWeights.streak` | `0.1` | Per-attempt composite |

**Max Volt:**

```
maxVolt = scoredDayCount × dayMaxVolt   // default 7 × 100 = 700
```

Set `scoredDayCount: 10` → max **1000 Volt**.

---

## High-level pipeline

```
1. Filter attempts to last lookbackMonths
2. Group by calendar day (UTC date from startedAt ISO string)
3. Sort play days newest first
4. Take top scoredDayCount play days
5. For each play day → dayVolt (0–100)
6. Pad with empty slots (dayVolt = 0) until length === scoredDayCount
7. volt = sum of all slot dayVolt values
```

**Not consecutive calendar days.** Gaps between play days do not create zero slots—only **padding** when there are fewer than `scoredDayCount` play days in the window.

---

## Layer 1 — Attempt score (0–100)

For each counted attempt on a day:

```
accuracyPercent = computeVoltAccuracy({ wrongMoveCount, hintCount, totalMoveCount })
timingPercent   = computeRatingTimingPercent({ rating, durationMs })
streakPercent   = computeStreakPercent({ maxCorrectStreak, totalMoveCount })

attemptScore = accuracyPercent × 0.6
             + timingPercent   × 0.3
             + streakPercent   × 0.1
```

(`rating` from `riddleDifficultyToRating` on riddles; opening variants can pass `defaultOpeningVariantRating` or a custom value.)

---

## Layer 2 — Day Volt (0–100)

Attempts on the same calendar day only. Sorted by `startedAt` ascending (1st try = earliest).

| Try that day | Weight | Included |
|--------------|--------|----------|
| 1st | 60% | Yes |
| 2nd | 25% | Yes |
| 3rd | 15% | Yes |
| 4th+ | — | **Ignored** |

**No renormalization.** Missing 2nd/3rd tries leave that weight as **0**.

```
dayVolt = round(min(100, Σ (attemptScoreᵢ × weightᵢ)))
```

### Day max examples (all attempt scores = 100)

| Tries that day | Calculation | dayVolt |
|----------------|-------------|---------|
| 1 | 100 × 0.60 | **60** |
| 2 | 60 + 25 | **85** |
| 3 | 60 + 25 + 15 | **100** |

**100 Volt for one day requires 3 attempts** when weights are `[0.6, 0.25, 0.15]`.

---

## Layer 3 — Slots and total Volt

| Situation | Behavior |
|-----------|----------|
| Played day in top N | `dayVolt` computed, `isPlayed: true`, `date` set |
| Fewer than N play days in window | Remaining slots `dayVolt: 0`, `isPlayed: false`, `date: null` |
| More than N play days | Only **newest N** play days count |

```
volt = Σ days[i].dayVolt
display: "{volt}/{maxVolt} Volt"
```

Example: 4 strong play days (100 each) + 3 padding slots → **400/700 Volt**.

---

## Calendar day grouping

```ts
calendarDay = attempt.startedAt.slice(0, 10)   // UTC YYYY-MM-DD
```

Lookback:

```ts
lookbackStart = now - lookbackMonths calendar months
```

Attempts with `startedAt < lookbackStart` are excluded.

---

## Result shape (`VoltScoreResult`)

Used for UI and detail views:

```ts
{
  volt: number;              // e.g. 400
  maxVolt: number;           // e.g. 700
  lookbackMonths: number;
  scoredDayCount: number;
  attemptsPerDayCounted: number;
  days: VoltDaySlot[];       // always length === scoredDayCount
}

VoltDaySlot = {
  slotIndex: number;         // 1..N, newest play day = 1
  date: string | null;       // YYYY-MM-DD or null if padding
  dayVolt: number;
  dayMaxVolt: number;        // 100
  isPlayed: boolean;
  attempts: VoltAttemptBreakdown[];
}

VoltAttemptBreakdown = {
  attemptId, attemptIndex, startedAt,
  accuracyPercent, timingPercent, streakPercent,
  attemptScore,
  attemptWeight,              // 0.6 | 0.25 | 0.15
  weightedContribution,       // attemptScore × attemptWeight
}
```

---

## Integration

### Server (riddle page)

```ts
buildVoltScore({
  attempts: await getAttemptsByUserAndSequence(supabase, userId, sequenceId),
  totalMoveCount: getSequenceMoveCount(riddle.moveSequence.moves),
  rating: riddleDifficultyToRating(riddle.difficulty),
})
```

Passed to `RiddleController` → `<VoltCalculator result={voltScore} />`.

### Refresh behavior

Volt is computed on **server render**. After a new solve, the player must **reload** the page (or you add revalidation) to see updated Volt.

### Opening variants

Use the same `buildVoltScore` with:

- `attempts` for that variant’s `sequenceId`
- `totalMoveCount` from variant moves
- `rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating` (or your own)

---

## UI

- Headline: **`{volt}/{maxVolt} Volt`**
- **Day breakdown** toggle: each slot shows date, `dayVolt/100`, per-try metrics and contributions
- Padding slots: “No attempts this slot”

---

## Calibration checklist

| Goal | Change |
|------|--------|
| Max 1000 instead of 700 | `scoredDayCount: 10` |
| Longer history | `lookbackMonths` |
| Easier full day | Adjust `attemptSlotWeights` or require fewer tries |
| Stricter per-try mix | `metricWeights` in `volt.config.ts` |
| Accuracy/timing/streak behavior | Edit respective sub-calculator configs |

---

## Dependency graph

```
volt-calculator
  ├── accuracy-calculator / computeVoltAccuracy
  ├── rating-timing-calculator / computeRatingTimingPercent
  └── streak-calculator / computeStreakPercent
```
