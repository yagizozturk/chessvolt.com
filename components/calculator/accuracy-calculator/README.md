# Accuracy calculator

Computes a **0–100% accuracy** score for one solve attempt. Used live on the riddle page and inside Volt when scoring stored attempts.

## Files

| File | Role |
|------|------|
| `volt-accuracy.config.ts` | Tunable weights |
| `compute-volt-accuracy.ts` | Pure formula |
| `accuracy-calculator.tsx` | React UI (`Target` icon, `"X% accuracy"`) |

## Inputs

| Field | Meaning |
|-------|---------|
| `wrongMoveCount` | Incorrect move attempts in the session |
| `hintCount` | Hints used |
| `totalMoveCount` | Number of half-moves in the sequence (parsed from `moveSequence.moves`) |

`correctMoveCount` is **not** used in this formula; accuracy is derived only from wrong and hint pressure relative to sequence size.

## Config (`VOLT_ACCURACY_CONFIG`)

| Key | Default | Meaning |
|-----|---------|---------|
| `basePercent` | `100` | Starting score before penalties |
| `wrongMovePenaltyWeight` | `40` | Max points lost if every move were wrong |
| `hintPenaltyWeight` | `20` | Max points lost if hints were used on every move |

## Formula

Ratios (capped at 1):

```
wrongRatio = min(wrongMoveCount / totalMoveCount, 1)
hintRatio  = min(hintCount / totalMoveCount, 1)
```

Penalties:

```
wrongPenalty = wrongRatio × wrongMovePenaltyWeight
hintPenalty  = hintRatio × hintPenaltyWeight
```

Result:

```
accuracy = round(clamp(basePercent - wrongPenalty - hintPenalty, 0, basePercent))
```

If `totalMoveCount <= 0`, return `basePercent` (100).

## Examples (`totalMoveCount = 10`)

| wrong | hints | Calculation | Accuracy |
|-------|-------|-------------|----------|
| 0 | 0 | 100 − 0 − 0 | **100%** |
| 5 | 0 | 100 − (0.5×40) − 0 = 80 | **80%** |
| 0 | 2 | 100 − 0 − (0.2×20) = 96 | **96%** |
| 5 | 5 | 100 − 20 − 10 | **70%** |

## Design notes

- Wrong moves and hints each have their own penalty budget (40 + 20 = 60 max loss at default config).
- Hints are measured against **sequence length**, not against “moves made so far.”
- This differs from the legacy `computeSequenceAttemptAccuracy` in `features/user-sequence-attempt` (correct / (correct + wrong + hints)), which is still used on collection board cards until migrated.

## UI usage

```tsx
<AccuracyCalculator
  wrongMoveCount={wrongMoveCount}
  hintCount={hintCount}
  totalMoveCount={moves.length}
/>
```

Wired in `features/riddle/components/riddle-controller.tsx` with live refs and `attemptStatsTick` re-renders on wrong moves and hints.

## Calibration

Edit `volt-accuracy.config.ts`. Increase `wrongMovePenaltyWeight` to punish mistakes more; increase `hintPenaltyWeight` to punish hints more.
