# VoltBoard piece animation fix

This document explains a bug where pieces on `VoltBoard` did not slide smoothly to the destination square (click-click or drag), especially on challenge/riddle screens. It covers what was wrong, what we changed, and why.

**Related code**

- `lib/chessground/hooks/use-chessgroud.ts`
- `components/boards/volt-board/volt-board.tsx`
- `lib/shared/constants/chess.ts` (`BOARD_ANIMATION_DELAY_MS`)

---

## Symptoms

- Selecting a piece and clicking a destination square: the piece **teleported** instead of sliding.
- Worked on `/test/test-board` but **failed** on challenge/riddle flows (`RiddleController`, `OpeningVariantController`).
- Similar issue had appeared before (commit `b3bfa57`: `updateBoard` tied to unstable callbacks / `useEffect` deps).

---

## Root causes

### 1. Calling `updateBoard()` right after every user move

`updateBoard()` calls `ground.set(getBoardConfig())`, which always includes **`fen: game.current.fen()`**.

Chessground’s `set({ fen })` re-reads the full position and re-placed pieces. When that runs immediately after `movable.events.after`:

- Click-click moves are already applied **instantly** by Chessground (`userMove` does not animate them).
- A full FEN reset **interrupts** any in-progress animation or forces an instant redraw.

So the fix is not “call `updateBoard` in a `useCallback`” alone — it is **not passing `fen`** after normal moves.

### 2. Challenge/riddle did extra work in the same tick as the move

On test-board, `onNextMoveRequest` returns `undefined` (no automatic opponent reply).

On challenge/riddle, after a correct user move the board immediately:

1. `onSuccessMovePlayed` → parent `setState` (goals, progress, `Notifier`)
2. `setSquareCustomHighlight` → `ground.set({ highlight })`
3. `onNextMoveRequest` → parent `setState` again + **`ground.move()` for the opponent**

Those ran synchronously with `replayAnimatedMove`, so React re-renders and extra `ground.set` calls **cut off** the user’s slide.

### 3. Chessground instance recreated on parent re-renders

The init `useEffect` depended on `getBoardConfig`. When that callback’s identity changed, the effect **destroyed and recreated** the whole board — another source of jumps and lost animation.

### 4. Click-click vs drag behavior in Chessground

- **Click-click**: `userMove` updates piece position instantly; no built-in slide. We must **replay** with `ground.move()` after resetting to `fenBefore`.
- **Drag**: The piece is already at the destination. Replaying would **snap back** then forward — so we skip replay and only sync metadata.

### 5. Promotions

`ground.move()` slides the **pawn**. `chess.js` already has the **queen** (or other promoted piece). We need a separate **`snapBoardToGameFen()`** step after the slide.

---

## What we changed

### `useChessground` (`use-chessgroud.ts`)

| Change | Why |
|--------|-----|
| Init effect deps: `[sourceId, boardRef]` only; config via `getBoardConfigRef` | Parent re-renders no longer destroy Chessground. |
| **`syncBoardAfterMove()`** | Updates turn, check, dests, last move, highlights — **no `fen`**. Safe after moves already on the board. |
| **`updateBoard()`** | Full FEN sync — only for wrong-move revert, PGN navigator, `initialFen` changes. |
| **`updateBoardRef`** | Stable ref for VoltBoard’s `initialFen` effect (avoids effect re-running when `updateBoard` identity changes). |
| **`replayAnimatedMove()`** | For click-click: `fen` → `fenBefore` (anim off), anim on, `ground.move(from, to)`. |
| **`snapBoardToGameFen()`** | For promotions: apply `game.current.fen()` with animation off, then turn anim back on. |
| **`setSquareCustomHighlight`** | Only sets `highlight` — never full config with `fen`. |

### `VoltBoard` (`volt-board.tsx`)

| Change | Why |
|--------|-----|
| Removed `updateBoard()` from `onMove` after correct moves | Avoid FEN reset mid-animation. |
| **`postMoveTimeoutRef`** + `BOARD_ANIMATION_DELAY_MS` (220ms) | Defer parent callbacks, success highlight, opponent move until user slide finishes. |
| **`fenBefore`** captured in `onMove` before `makeMove` | Used to replay click-click animation from the real pre-move position. |
| Opponent reply via **`ground.move()`** | Animated reply; `makeMove` alone only updates chess.js. |
| **`syncBoardAfterMove`** delayed after opponent when needed | Turn/dests sync runs after opponent slide, not during user slide. |
| Drag: skip `replayAnimatedMove`; promotion drag uses `snapBoardToGameFen` | Don’t snap back a piece the user already dragged to the square. |

### Constants (`lib/shared/constants/chess.ts`)

- **`BOARD_ANIMATION_DELAY_MS = 220`** — Chessground default slide (200ms) + small buffer for deferred callbacks.

---

## Correct move flow (after fix)

```
User moves on board (cg userMove — instant visually)
        ↓
onMove: fenBefore = chess.js FEN (before makeMove)
        ↓
makeMove in chess.js
        ↓
If click-click → replayAnimatedMove(fenBefore → ground.move)
If drag       → skip replay
        ↓
Wait BOARD_ANIMATION_DELAY_MS
        ↓
onSuccessMovePlayed, highlight, onNextMoveRequest
        ↓
If opponent UCI → makeMove + ground.move()
        ↓
syncBoardAfterMove() (no fen)
```

**Wrong move:** cg may show the illegal training move on the board; after delay, `updateBoard()` (full fen) snaps back to chess.js.

---

## When to use which API

| Function | Passes `fen`? | Use when |
|----------|---------------|----------|
| `updateBoard()` | Yes | Wrong-move revert, `initialFen` / PGN ply change |
| `syncBoardAfterMove()` | No | After normal move; board pieces already correct |
| `replayAnimatedMove()` | Briefly `fenBefore`, then `move` | Click-click correct move |
| `snapBoardToGameFen()` | Yes (anim off) | Promotion (pawn → queen) |

---

## How to verify

1. **`/test/test-board`** — click-click and drag; piece should slide (click) or stay smooth (drag).
2. **Challenge/riddle** — same, plus opponent reply should animate after your move.
3. **Wrong move** — piece reverts to position after `WRONG_MOVE_REVERT_DELAY_MS`.
4. **PGN navigator** — changing ply still resets position via `updateBoardRef` on `initialFen` change.

---

## What we removed as redundant

- `scheduleSyncBoardAfterMove` — timing handled in VoltBoard’s `postMoveTimeoutRef`.
- `playOpponentMoveAnimated` — thin wrapper; inlined as `ground.move()`.
- `syncBoardState` / omitting `fen` only in a shared `set` without the rest of the flow — not enough on its own.
- Split `BOARD_ANIMATION_MS` + buffer — merged into `BOARD_ANIMATION_DELAY_MS`.

---

## References

- Chessground `movable.events.after` is deferred with `setTimeout(..., 1)` internally; user moves clear `animation.current` in `baseUserMove`.
- `ground.set({ fen })` uses the `anim` path; `set` without `fen` uses `render` — see `api.ts` in `@lichess-org/chessground`.
- Prior partial fix: commit `b3bfa57` (`updateBoard` as `useCallback`, `initialFen`-only effect in VoltBoard).
