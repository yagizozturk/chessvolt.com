// TODO: Refactor
# Volt calculator

Aggregates a user’s **historical attempts** on one riddle or opening variant into a single **Volt** score (e.g. **110/220 Volt**), with a per-day breakdown for detail views.

Volt composes the three sub-calculators: **accuracy**, **rating–timing**, and **streak**.

## Files

| File | Role |
|------|------|
| `volt.config.ts` | Lookback, day count, weights |
| `volt.types.ts` | `VoltScoreResult`, day/attempt breakdown types |
| `compute-volt.ts` | Core aggregation logic |
| `build-volt-score.ts` | Maps `UserSequenceAttempt[]` → score (`calculateVoltScore`) |
| `get-sequence-move-count.ts` | `getPlayerMoveCount` for scoring denominators |
| `volt-calculator.tsx` | UI: radial chart + hover day breakdown |

## Scope

- **One move sequence** = one riddle or one opening variant (`sequenceId`).
- **Logged-in user** only; guests get `result: null`.
- Data source: `user_sequence_attempt` rows (`getAttemptsByUserAndSequence`).

## Config (`VOLT_CONFIG`)

| Key | Default | Meaning |
|-----|---------|---------|
| `lookbackMonths` | `3` | Only attempts with `startedAt` in this window |
| `scoredDayCount` | `5` | Always **5 slots** in the sum |
| `dayMaxVolt` | `44` | Max points per played day |
| `attemptsPerDayCounted` | `3` | 1st–3rd tries per day; **4th+ ignored** |
| `attemptSlotWeights` | `[0.5, 0.3, 0.2]` | Per-try weights within a day (**no renormalization**) |
| `metricWeights.accuracy` | `0.6` | Per-attempt composite |
| `metricWeights.timing` | `0.3` | Per-attempt composite |
| `metricWeights.streak` | `0.1` | Per-attempt composite |

**Max Volt:**

```
maxVolt = scoredDayCount × dayMaxVolt   // default 5 × 44 = 220
```

Helpers: `getVoltMaxScore()`, `getVoltLookbackStart(now?)`.

---

## High-level pipeline

```
1. Filter attempts to last lookbackMonths
2. Group by calendar day (UTC date from startedAt ISO string)
3. Sort play days newest first
4. Take top scoredDayCount play days
5. For each play day → dayVolt (0–dayMaxVolt)
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

- `totalMoveCount` = **player half-moves** via `getPlayerMoveCount(moves)` (excludes opponent auto-replies).
- `rating` from `getRiddleRatingForScoring(riddle.rating)` on riddles (defaults to **1600** when null); opening variants use `defaultOpeningVariantRating` (**2000**) or a custom value.

---

## Layer 2 — Day Volt (0–dayMaxVolt)

Attempts on the same calendar day only. Sorted by `startedAt` ascending (1st try = earliest).

| Try that day | Weight | Included |
|--------------|--------|----------|
| 1st | 50% | Yes |
| 2nd | 30% | Yes |
| 3rd | 20% | Yes |
| 4th+ | — | **Ignored** |

**No renormalization.** Missing 2nd/3rd tries leave that weight as **0**.

First compute a 0–100 composite, then scale to day points:

```
rawDayScore = Σ (attemptScoreᵢ × weightᵢ)          // 0–100
dayVolt     = round(min(dayMaxVolt, rawDayScore × dayMaxVolt / 100))
```

Per-attempt Volt contribution (used in UI):

```
attemptVoltPoints = round(weightedContribution × dayMaxVolt / 100)
```

### Day max examples (all attempt scores = 100, `dayMaxVolt = 44`)

| Tries that day | rawDayScore | dayVolt |
|----------------|-------------|---------|
| 1 | 100 × 0.50 = 50 | **22** |
| 2 | 50 + 30 = 80 | **35** |
| 3 | 50 + 30 + 20 = 100 | **44** |

**Full day credit requires 3 attempts** when weights are `[0.5, 0.3, 0.2]`.

---

## Layer 3 — Slots and total Volt

| Situation | Behavior |
|-----------|----------|
| Played day in top N | `dayVolt` computed, `isPlayed: true`, `date` set |
| Fewer than N play days in window | Remaining slots `dayVolt: 0`, `isPlayed: false`, `date: null` |
| More than N play days | Only **newest N** play days count |

```
volt = Σ days[i].dayVolt
display: "{volt}/{maxVolt} Volt" (detail) or "{volt}v" (compact list cards)
```

Example: 3 strong play days (44 each) + 2 padding slots → **132/220 Volt**.

---

## Calendar day grouping

```ts
calendarDay = attempt.startedAt.slice(0, 10)   // UTC YYYY-MM-DD
```

Lookback:

```ts
lookbackStart = getVoltLookbackStart(now)   // now - lookbackMonths calendar months
```

Attempts with `startedAt < lookbackStart` are excluded.

---

## Result shape (`VoltScoreResult`)

Used for UI and detail views:

```ts
{
  volt: number;              // e.g. 132
  maxVolt: number;           // e.g. 220
  lookbackMonths: number;
  scoredDayCount: number;
  attemptsPerDayCounted: number;
  days: VoltDaySlot[];       // always length === scoredDayCount
}

VoltDaySlot = {
  slotIndex: number;         // 1..N, newest play day = 1
  date: string | null;       // YYYY-MM-DD or null if padding
  dayVolt: number;
  dayMaxVolt: number;        // 44
  isPlayed: boolean;
  attempts: VoltAttemptBreakdown[];
}

VoltAttemptBreakdown = {
  attemptId, attemptIndex, startedAt,
  accuracyPercent, timingPercent, streakPercent,
  attemptScore,
  attemptWeight,              // 0.5 | 0.3 | 0.2
  weightedContribution,       // attemptScore × attemptWeight (0–100 scale)
}
```

---

## Integration

### Server (riddle / variant page)

```ts
calculateVoltScore({
  attempts: await getAttemptsByUserAndSequence(supabase, userId, sequenceId),
  totalMoveCount: getPlayerMoveCount(riddle.moveSequence.moves),
  rating: getRiddleRatingForScoring(riddle.rating),
})
```

Passed to `RiddleController` / `OpeningVariantController` → `<VoltCalculator result={voltScore} />`.

### Refresh behavior

Volt is computed on **server render**. After a new solve, the player must **reload** the page (or you add revalidation) to see updated Volt.

### Opening variants

Use the same `calculateVoltScore` with:

- `attempts` for that variant’s `sequenceId`
- `totalMoveCount` from `getPlayerMoveCount(variant.moveSequence.moves)`
- `rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating` (or your own)

---

## UI

- **Detail view:** radial chart (`RadialChart`) showing `{volt}/{maxVolt}`; hover opens day breakdown
- **List cards:** compact `{volt}v` when `showDetails={false}`
- **Day breakdown:** each slot shows date, `dayVolt/dayMaxVolt`, per-try metrics and `+attemptVoltPoints`
- Padding slots: “No attempts for this slot”

---

## Calibration checklist

| Goal | Change |
|------|--------|
| Higher max Volt | Raise `scoredDayCount` and/or `dayMaxVolt` |
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
