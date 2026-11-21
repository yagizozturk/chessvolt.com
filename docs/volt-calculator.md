# Volt calculator

Aggregates a user’s **historical attempts** on one puzzle or opening variant into a single **Volt** score (e.g. **620/1000 Volt**), with a per-day breakdown for detail views.

Volt composes the three sub-calculators: **accuracy**, **rating–timing**, and **streak**.

## Files

| File                         | Role                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| `volt.config.ts`             | Lookback, day count, weights                                |
| `volt.types.ts`              | `VoltScoreResult`, day/attempt breakdown types              |
| `compute-volt.ts`            | Core aggregation logic                                      |
| `build-volt-score.ts`        | Maps `UserSequenceAttempt[]` → score (`calculateVoltScore`) |
| `get-sequence-move-count.ts` | `getPlayerMoveCount` for scoring denominators               |
| `volt-calculator.tsx`        | UI: battery gauge + hover day breakdown                     |
| `volt-score-battery.tsx`     | `VoltScoreResult` → battery cells + gauge (`VoltScoreBattery`) |
| `volt-latest-solve.ts`       | Latest solve lookup + its day's before/after charge          |

## Scope

- **One move sequence** = one puzzle or one opening variant (`sequenceId`).
- **Logged-in user** only; guests get `result: null`.
- Data source: `user_sequence_attempt` rows (`getAttemptsByUserAndSequence`).
- **Only `status = "completed"` attempts count** (`isVoltCountedAttempt`). `started` / `abandoned` / `failed` rows are ignored.

## Config (`VOLT_CONFIG`)

| Key                      | Default           | Meaning                                                  |
| ------------------------ | ----------------- | -------------------------------------------------------- |
| `lookbackMonths`         | `3`               | Only attempts with `startedAt` in this window            |
| `scoredDayCount`         | `4`               | Always **4 slots** in the sum                            |
| `dayMaxVolt`             | `250`             | Max points per played day (%25 of the battery)           |
| `bestAttemptWeights`     | `[0.5, 0.3, 0.2]` | Weights for the day's **best** solves by score           |
| `lowFillPercent`         | `30`              | Day fill % at or below this is shown red, above is green |
| `metricWeights.accuracy` | `0.6`             | Per-attempt composite                                    |
| `metricWeights.timing`   | `0.3`             | Per-attempt composite                                    |
| `metricWeights.streak`   | `0.1`             | Per-attempt composite                                    |

**Max Volt:**

```
maxVolt = scoredDayCount × dayMaxVolt   // default 4 × 250 = 1000
```

Helpers: `getVoltMaxScore()`, `getVoltLookbackStart(now?)`, `getBestAttemptsCounted()`, `getFillPercent(value, max)`, `isLowFillPercent(percent)`.

---

## High-level pipeline

```
1. Keep completed attempts in the last lookbackMonths
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

For every completed attempt on a day:

```
accuracyPercent = computeVoltAccuracy({ wrongMoveCount, hintCount, totalMoveCount })
timingPercent   = computeRatingTimingPercent({ rating, durationMs })
streakPercent   = computeStreakPercent({ maxCorrectStreak, totalMoveCount })

attemptScore = accuracyPercent × 0.6
             + timingPercent   × 0.3
             + streakPercent   × 0.1
```

- `totalMoveCount` = **player half-moves** via `getPlayerMoveCount(moves)` (excludes opponent auto-replies).
- `rating` from `getPuzzleRatingForScoring(puzzle.rating)` on puzzles (defaults to **1600** when null); opening variants use `defaultOpeningVariantRating` (**2000**) or a custom value.

---

## Layer 2 — Day Volt (0–dayMaxVolt)

Attempts on the same calendar day only. The player may solve **any number of times**; every solve is scored, then ranked by `attemptScore` (best first, ties → earlier solve).

| Rank that day | Weight | Included                       |
| ------------- | ------ | ------------------------------ |
| Best          | 50%    | Yes                            |
| 2nd best      | 30%    | Yes                            |
| 3rd best      | 20%    | Yes                            |
| 4th+          | 0      | Shown in breakdown, no Volt    |

**No renormalization.** Fewer than 3 solves leave the missing weights as **0**.

```
rawDayScore = Σ (attemptScoreᵢ × weightᵢ)          // 0–100, top 3 only
dayVolt     = round(min(dayMaxVolt, rawDayScore × dayMaxVolt / 100))
dayFill%    = round(dayVolt / dayMaxVolt × 100)    // battery cell height
```

Per-attempt Volt contribution (internal; the UI converts it to a battery %):

```
attemptVoltPoints = round(weightedContribution × dayMaxVolt / 100)
```

### Day max examples (all attempt scores = 100, `dayMaxVolt = 250`)

| Solves that day | rawDayScore        | dayVolt | Day   |
| --------------- | ------------------ | ------- | ----- |
| 1               | 100 × 0.50 = 50    | **125** | 50%   |
| 2               | 50 + 30 = 80       | **200** | 80%   |
| 3+              | 50 + 30 + 20 = 100 | **250** | 100%  |

**Full day credit requires 3 strong solves.** A weak solve never lowers the day: it only counts if it is among the best 3.

---

## Layer 3 — Slots and total Volt

| Situation                        | Behavior                                                      |
| -------------------------------- | ------------------------------------------------------------- |
| Played day in top N              | `dayVolt` computed, `isPlayed: true`, `date` set              |
| Fewer than N play days in window | Remaining slots `dayVolt: 0`, `isPlayed: false`, `date: null` |
| More than N play days            | Only **newest N** play days count                             |

```
volt = Σ days[i].dayVolt
display: "%{round(volt / maxVolt × 100)}" — percentages only (see UI)
```

Example: 3 full play days (250 each) + 1 padding slot → **750/1000 Volt** (%75).

---

## Calendar day grouping

```ts
calendarDay = attempt.startedAt.slice(0, 10); // UTC YYYY-MM-DD
```

Lookback:

```ts
lookbackStart = getVoltLookbackStart(now); // now - lookbackMonths calendar months
```

Attempts with `startedAt < lookbackStart` are excluded.

---

## Result shape (`VoltScoreResult`)

Used for UI and detail views:

```ts
{
  volt: number;              // e.g. 620
  maxVolt: number;           // e.g. 1000
  lookbackMonths: number;
  scoredDayCount: number;
  bestAttemptsCounted: number; // 3
  days: VoltDaySlot[];       // always length === scoredDayCount
}

VoltDaySlot = {
  slotIndex: number;         // 1..N, newest play day = 1
  date: string | null;       // YYYY-MM-DD or null if padding
  dayVolt: number;
  dayMaxVolt: number;        // 250
  isPlayed: boolean;
  attempts: VoltAttemptBreakdown[]; // every completed solve that day, chronological
}

VoltAttemptBreakdown = {
  attemptId, attemptIndex, startedAt,
  rank,                       // 1 = best score that day
  isCounted,                  // rank <= bestAttemptsCounted
  accuracyPercent, timingPercent, streakPercent,
  attemptScore,
  attemptWeight,              // 0.5 | 0.3 | 0.2 | 0
  weightedContribution,       // attemptScore × attemptWeight (0–100 scale)
}
```

---

## Integration

### Server (puzzle / variant page)

```ts
calculateVoltScore({
  attempts: await getAttemptsByUserAndSequence(supabase, userId, sequenceId),
  totalMoveCount: getPlayerMoveCount(puzzle.moveSequence.moves),
  rating: getPuzzleRatingForScoring(puzzle.rating),
});
```

Passed to `PuzzleController` / `OpeningVariantController` → `<VoltCalculator result={voltScore} />`.

### Refresh behavior

Volt is computed on **server render**. After a new solve, the player must **reload** the page (or you add revalidation) to see updated Volt.

### Opening variants

Use the same `calculateVoltScore` with:

- `attempts` for that variant’s `sequenceId`
- `totalMoveCount` from `getPlayerMoveCount(variant.moveSequence.moves)`
- `rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating` (or your own)

---

## UI

**Rule: the UI shows charge only as whole percentages** (`%62`, `%12 Full`). Volt amounts like `250 / 1000 Volt` are never displayed; `volt`, `dayVolt` and `maxVolt` are internal and only used to compute percentages (`getFillPercent`).

- Rounding (`roundPercent`): a fraction above .5 rounds up, .5 or below rounds down (9.1 → 9, 5.5 → 5, 5.51 → 6). Results are clamped to 0–100, so nothing ever shows above 100%.
- Breakdowns (`splitPercent`): a whole total is split across parts so they always add up to exactly the total (largest-remainder method).

- **Battery** (`VoltScoreBattery` → `VoltBattery` in `components/volt-battery/volt-battery.tsx`): one flat, pure-CSS battery icon for the **total** charge (`volt / maxVolt`): grey outline with a rounded terminal bump, an inset fill growing left → right, and Zap + `%{total}` written inside. The readout is drawn twice: in the theme text color over the empty part and in dark, clipped to the fill width, over the fill. Row icons use `showReadout={false}`.
- Fill color: above `lowFillPercent` = green, at or below = red.
- **Cards:** battery in the card corner; hover opens the day breakdown with the total `%{total} Full` (red ≤ 30%, green above).
- **Solve success dialog:** headline "You Charged +%X" = the latest solve's own share (`weightedContribution × dayMaxVolt / 100`) as a whole % of the battery (`getFillPercent(share, maxVolt)`). The Accuracy / Max streak / Time tiles split that total by metric with `splitPercent`, so the three tiles always add up to the headline. Below them, the battery (`chargeLatestSolve`) and the day breakdown sit side by side; the battery starts from the total before that solve and charges to the new total (`getLatestSolveCharge` in `volt-latest-solve.ts`).
- **Day breakdown:** each slot shows date, "Solved N times", a mini battery icon (`showReadout={false}`) and `%{dayFill} Full` (red ≤ 30%, green above).
- **List cards:** compact `%{total}` when `showDetails={false}`.
- **Landing demo** (`features/landing/components/what-is-volt.tsx`): the lightning charges by one full day (`dayMaxVolt`) per "Correct Repetition" click, out of `getVoltMaxScore()`; the counter shows `%{charge}`.

---

## Calibration checklist

| Goal                            | Change                                             |
| ------------------------------- | -------------------------------------------------- |
| Higher max Volt                 | Raise `scoredDayCount` and/or `dayMaxVolt`         |
| Red / green threshold           | `lowFillPercent`                                   |
| Longer history                  | `lookbackMonths`                                   |
| Easier full day                 | Adjust `bestAttemptWeights` (fewer / larger weights) |
| Stricter per-try mix            | `metricWeights` in `volt.config.ts`                |
| Accuracy/timing/streak behavior | Edit respective sub-calculator configs             |

---

## Dependency graph

```
volt-calculator
  ├── accuracy-calculator / computeVoltAccuracy
  ├── rating-timing-calculator / computeRatingTimingPercent
  └── streak-calculator / computeStreakPercent
```
