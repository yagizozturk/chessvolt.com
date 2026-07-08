// TODO: Refactor
# Streak calculator

Computes a **0–100% streak** score from the **longest consecutive correct moves** (`maxCorrectStreak`) relative to **player move count**.

## Files

| File | Role |
|------|------|
| `streak.config.ts` | Ratio → percent tiers |
| `compute-streak.ts` | Piecewise interpolation |
| `streak-calculator.tsx` | React UI (`Flame` icon, `"X% streak"`) |

## Inputs

| Field | Meaning |
|-------|---------|
| `maxCorrectStreak` | Longest run of correct moves in the attempt (stored on `user_sequence_attempt`) |
| `totalMoveCount` | **Player half-moves** the human must find (`getPlayerMoveCount`; excludes opponent auto-replies) |

## Streak ratio

```
streakRatio = min(max(maxCorrectStreak, 0) / totalMoveCount, 1)
```

Examples with `totalMoveCount = 10` (player moves):

| maxCorrectStreak | streakRatio |
|------------------|-------------|
| 0 | 0 |
| 5 | 0.5 |
| 8 | 0.8 |
| 10 | 1.0 |

## Config (`STREAK_RATIO_INTERVALS`)

Piecewise tiers: at each `streakRatio`, the table defines the streak **%**. Sorted ascending by `streakRatio`.

| streakRatio | streakPercent |
|-------------|---------------|
| 0.0 | 0% |
| 0.3 | 35% |
| 0.5 | 55% |
| 0.6 | 70% |
| 0.7 | 85% |
| 0.8 | 100% |
| 1.0 | 100% |

`STREAK_CONFIG.basePercent` caps the result at **100**. Intervals are exposed as `STREAK_CONFIG.streakIntervals`.

## Formula

```
if totalMoveCount <= 0 → return basePercent
if maxCorrectStreak <= 0 → return 0

streakRatio = maxCorrectStreak / totalMoveCount (capped at 1)
streakPercent = interpolateStreakPercent(streakRatio)   // piecewise linear between rows
```

Interpolation between two rows `(low, high)`:

```
t = (streakRatio - low.streakRatio) / (high.streakRatio - low.streakRatio)
raw = low.streakPercent + t × (high.streakPercent - low.streakPercent)
return round(clamp(raw, 0, basePercent))
```

## Examples (`totalMoveCount = 10`)

| maxCorrectStreak | streakRatio | streak % |
|------------------|-------------|----------|
| 0 | 0 | **0%** |
| 3 | 0.3 | **35%** |
| 5 | 0.5 | **55%** |
| 7 | 0.7 | **85%** |
| 8 | 0.8 | **100%** |
| 10 | 1.0 | **100%** |

Between tiers (e.g. ratio **0.75** between 0.7→85% and 0.8→100%): **92.5%** → **93%** rounded.

## Design notes

- Uses **ratio** (`maxCorrectStreak / totalMoveCount`), not raw streak count alone, so an 8-streak means the same on 10-move and 20-move sequences (0.8 vs 0.4).
- Denominator is **player moves only**, matching accuracy and Volt scoring (`getPlayerMoveCount`).
- Full **100%** at default config requires ratio **≥ 0.8** (e.g. 8/10 player moves).
- Streak resets on each wrong move during play (`currentCorrectStreakRef`); `maxCorrectStreakRef` keeps the peak for the attempt.

## UI usage

```tsx
<StreakCalculator
  maxCorrectStreak={maxCorrectStreak}
  totalMoveCount={getPlayerMoveCount(moves)}
/>
```

Updates on correct moves (via `attemptStatsTick`) and wrong moves (streak reset).

## Calibration

Add or edit rows in `STREAK_RATIO_INTERVALS`. Keep `streakRatio` ascending. Lower the 100% tier (e.g. `0.8` → `0.9`) to require a longer relative streak for full credit.
