// TODO: Refactor
# Rating–timing calculator

Computes a **0–100% timing** score for one solve attempt based on **how long** the user took versus a **rating-based** time budget (harder content → more time allowed for full credit).

## Files

| File | Role |
|------|------|
| `rating-timing.config.ts` | Intervals, grace settings, default variant rating |
| `compute-rating-timing.ts` | Interpolation + percent formula |
| `rating-timing-calculator.tsx` | React UI (`Clock` icon, `"X% timing"`) |

## Inputs

| Field | Meaning |
|-------|---------|
| `rating` | Elo-style difficulty (e.g. 1200–2600); riddles use `getRiddleRatingForScoring(riddle.rating)` |
| `durationMs` | Elapsed solve time in ms; `null` or `≤ 0` → full score (not started) |

## Config

### `RATING_TIMING_INTERVALS`

Piecewise tiers: at each `rating`, solve at or under `fullTimeMs` earns the start of the timing curve for that tier. Rows must be sorted by ascending `rating`. Exposed as `RATING_TIMING_CONFIG.ratingIntervals`.

| Rating | Full-score time |
|--------|-----------------|
| 1200 | 45s |
| 1400 | 50s |
| 1600 | 55s |
| 1800 | 1m |
| 2000 | 1m 30s |
| 2200 | 2m |
| 2400 | 2m 30s |
| 2600 | 3m |

Between two rows, `fullTimeMs` is **linearly interpolated**. Rating is clamped to `[minRating, maxRating]` from the interval table.

### `RATING_TIMING_CONFIG`

| Key | Default | Meaning |
|-----|---------|---------|
| `basePercent` | `100` | Timing % at or under full threshold |
| `gracePenaltyWeight` | `20` | Max % lost after grace window |
| `graceDurationRatio` | `2/3` | Grace length = `fullTimeMs × ratio` |
| `defaultOpeningVariantRating` | `2000` | When variant has no rating field |

### Riddle rating for scoring

Riddles store an explicit `rating` (100–3000). For timing/Volt:

```ts
getRiddleRatingForScoring(riddle.rating)   // null → DEFAULT_RIDDLE_RATING (1600)
```

## Step 1 — Full-score time

```
fullTimeMs = interpolateFullTimeMs(rating)   // piecewise linear on intervals
```

## Step 2 — Grace window

```
graceMs = round(fullTimeMs × graceDurationRatio)
```

Example at rating **2600**: `fullTimeMs = 180_000` (3 min), `graceMs = 120_000` (2 min).

## Step 3 — Timing percent

```
if durationMs is null or ≤ 0 → return basePercent

if durationMs ≤ fullTimeMs → return basePercent

if graceMs ≤ 0 → return basePercent - gracePenaltyWeight

if durationMs ≥ fullTimeMs + graceMs → return basePercent - gracePenaltyWeight

overtimeMs = durationMs - fullTimeMs
penaltyRatio = overtimeMs / graceMs
timing = round(clamp(basePercent - penaltyRatio × gracePenaltyWeight, 0, basePercent))
```

## Examples (default config)

### Rating 2600 (full 3 min, grace 2 min)

| Solve time | Timing % |
|------------|----------|
| ≤ 3:00 | **100%** |
| 4:00 | 90% (halfway through grace) |
| ≥ 5:00 | **80%** |

### Rating 1800 (full 1 min, grace 40 s)

| Solve time | Timing % |
|------------|----------|
| ≤ 1:00 | **100%** |
| ≥ 1:40 | **80%** |

## UI usage

```tsx
<RatingTimingCalculator rating={timingRating} durationMs={elapsedMs} />
```

- `timingRating` from `getRiddleRatingForScoring(riddle.rating)`
- `elapsedMs` updated every 500 ms while solving; frozen on completion

## Calibration

1. Edit rows in `RATING_TIMING_INTERVALS` for per-rating time budgets.
2. Edit `gracePenaltyWeight` / `graceDurationRatio` for how harsh overtime is.
3. Edit `DEFAULT_RIDDLE_RATING` in `features/riddle/types/riddle-rating.ts` for unrated riddles.

## Exported helpers

- `getFullScoreTimeMs(rating)`
- `getGraceDurationMs(rating)`
