// TODO: Refactor
# Calculator modules

This folder contains scoring calculators used during play and for aggregate **Volt** progress. Each subfolder has its own `README.md` with full formulas and logic.

## Overview

| Module | Purpose | Output |
|--------|---------|--------|
| [accuracy-calculator](./accuracy-calculator/README.md) | Penalize wrong moves and hints vs sequence length | 0–100% accuracy |
| [rating-timing-calculator](./rating-timing-calculator/README.md) | Score solve speed vs content rating | 0–100% timing |
| [streak-calculator](./streak-calculator/README.md) | Score longest correct run vs sequence length | 0–100% streak |
| [volt-calculator](./volt-calculator/README.md) | Aggregate historical attempts into Volt | 0–700 Volt (configurable) |

## How they relate

```
Single attempt (live or stored)
  ├── computeVoltAccuracy()      → accuracy %
  ├── computeRatingTimingPercent() → timing %
  └── computeStreakPercent()     → streak %

Volt (historical, per riddle/variant)
  └── Combines many attempts over N day slots
        └── Each attempt uses the three calculators above
```

**Live UI** (riddle solve sidebar): accuracy, timing, and streak update during the session.

**Volt UI**: built on the server from `user_sequence_attempt` rows for the move sequence; shown as `400/700 Volt` with an expandable day breakdown.

## Calibration

Each module keeps tunable values in a `*.config.ts` file. Changing config adjusts scoring without changing the structure of the formulas (unless you add new interval rows).

## Code entry points

- Accuracy: `AccuracyCalculator` → `computeVoltAccuracy`
- Timing: `RatingTimingCalculator` → `computeRatingTimingPercent`
- Streak: `StreakCalculator` → `computeStreakPercent`
- Volt: `buildVoltScore` → `computeVoltScore` → `VoltCalculator`
