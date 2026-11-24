# ChessVolt mobile API

Reference for the ChessVolt mobile app (Expo / React Native). It covers every `/http` endpoint the app uses and is
meant to be copied into the mobile repo as is. The source of truth is the web repo: route handlers in `app/http/**`,
types in the files named next to each type below.

Mobile v1.0 scope: sign-in, onboarding, profile, game analysis (Chess.com / Lichess) and Volt Tracker for game
mistakes. Puzzle and opening endpoints are documented where they share a route, but the app does not need them yet.

Last updated: 2026-11-23.

---

## Basics

| Item         | Value                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| Base URL     | `https://www.chessvolt.com` in production; `http://<your-machine-LAN-IP>:3000` against `next dev` |
| Paths        | Every endpoint lives under `/http`, for example `GET /http/profile`                               |
| Auth         | `Authorization: Bearer <supabase access_token>` on every request                                  |
| Request body | JSON object, `Content-Type: application/json`                                                     |
| Ids          | UUID strings, except game ids (Chess.com game `uuid`, Lichess game `id`)                          |
| Timestamps   | ISO 8601 strings (UTC)                                                                            |

- Call the `www` host directly and do not add trailing slashes. Redirects (apex → `www`, `/path/` → `/path`) can make
  HTTP clients drop the `Authorization` header.
- The app never talks to the database directly. Supabase is used only for sign-in and the session.

### Response envelope

Every endpoint answers with the same JSON shape:

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T; // present when success is true
  error?: string; // present when success is false; human-readable English
};
```

The `data` types below describe `data` only. Two older routes (attempts and attempt events) nest a second `success`
flag inside `data`; their sections show it.

### Status codes

| Status | Meaning                                                                         |
| ------ | ------------------------------------------------------------------------------- |
| 200    | Success                                                                         |
| 400    | Invalid input; `error` says which field                                         |
| 401    | Missing, invalid or expired access token (`error: "Unauthorized"`)              |
| 404    | The resource does not exist or belongs to someone else                          |
| 409    | Conflict with the current state (onboarding already done)                       |
| 422    | Valid input that cannot be used (for example an unknown Chess.com username)     |
| 429    | Chess.com / Lichess rate limit; retry later                                     |
| 500    | Server or database error                                                        |
| 502    | Upstream (Chess.com, Lichess) unreachable; other upstream statuses pass through |

### Authentication

1. Sign the user in with `@supabase/supabase-js` in the app (email/password or OAuth), with `autoRefreshToken: true`
   and a persistent storage adapter.
2. Send the current `session.access_token` as `Authorization: Bearer <token>` on every request.
3. On `401`, refresh once (`supabase.auth.refreshSession()`) and retry. If it is still `401`, sign the user out.

The server verifies the token with Supabase Auth and runs every query as that user, so row-level security applies:
a user can only read and change their own rows. An invalid token is rejected and never falls back to anything else.

```ts
const {
  data: { session },
} = await supabase.auth.getSession();

const response = await fetch(`${API_BASE_URL}/http/profile`, {
  headers: { Authorization: `Bearer ${session?.access_token}` },
});
const body: ApiResponse<UserProfileData> = await response.json();
```

The `curl` examples below use two shell variables:

```bash
export API=https://www.chessvolt.com
export TOKEN='<supabase access_token>'
```

---

## Endpoint index

All endpoints require a signed-in user.

| Method | Path                                                                                             | Purpose                                                |
| ------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| GET    | [`/http/profile`](#get-httpprofile)                                                              | Current user's profile and onboarding state            |
| PATCH  | [`/http/profile/username`](#patch-httpprofileusername)                                           | Change the display name                                |
| PATCH  | [`/http/profile/platform-usernames`](#patch-httpprofileplatform-usernames)                       | Link or unlink Chess.com and Lichess accounts          |
| PATCH  | [`/http/profile/rating`](#patch-httpprofilerating)                                               | ±5 rating after a puzzle (web puzzles; not used in v1) |
| POST   | [`/http/onboarding/complete`](#post-httponboardingcomplete)                                      | Finish onboarding and set the initial rating           |
| GET    | [`/http/game-analysis/chesscom-games`](#get-httpgame-analysischesscom-games)                     | Recent Chess.com games of a username                   |
| GET    | [`/http/game-analysis/lichess-games`](#get-httpgame-analysislichess-games)                       | Recent Lichess games of a username                     |
| GET    | [`/http/game-analysis/{gameId}`](#get-httpgame-analysisgameid)                                   | Saved analysis of one game                             |
| POST   | [`/http/game-analysis/analyze-game/stockfish`](#post-httpgame-analysisanalyze-gamestockfish)     | Save an on-device engine analysis                      |
| GET    | [`/http/game-analysis/analyze-game?gameId=`](#get-httpgame-analysisanalyze-gamegameid)           | Same as `GET /http/game-analysis/{gameId}`             |
| GET    | [`/http/volt-tracker`](#get-httpvolt-tracker)                                                    | Volt Tracker items with their Volt scores              |
| POST   | [`/http/favorites/toggle`](#post-httpfavoritestoggle)                                            | Add or remove a Volt Tracker item                      |
| POST   | [`/http/move-sequence/{sequenceId}/attempt`](#post-httpmove-sequencesequenceidattempt)           | Start, update or complete a practice attempt           |
| POST   | [`/http/user-sequence-attempt/{attemptId}/event`](#post-httpuser-sequence-attemptattemptidevent) | Log a move or hint (optional)                          |
| DELETE | [`/http/account`](#delete-httpaccount)                                                           | Delete the account and all of its data                 |

---

## Typical flows

### After sign-in

1. `GET /http/profile`.
2. If `onboardingCompleted` is `false`, show onboarding and finish it with `POST /http/onboarding/complete`. The
   response contains the updated profile.

### Analyzing a game

1. List games with `GET /http/game-analysis/chesscom-games?username=…` and/or
   `GET /http/game-analysis/lichess-games?username=…`, using `chesscomUsername` / `lichessUsername` from the profile.
2. Open a game: `GET /http/game-analysis/{gameId}` with the Chess.com `uuid` or the Lichess `id`.
   - `data` is not `null`: show it. It was analyzed before, on web or mobile.
   - `data` is `null`: analyze it with Stockfish on the device, then save the result with
     `POST /http/game-analysis/analyze-game/stockfish`. The server does not analyze games.
   - Always send `username` = the player's name on that platform. Mistakes are only created for that player's moves.
3. Each mistake (`questions[i]`) has a favorite toggle: `POST /http/favorites/toggle` with `gameAnalysisMistakeId`.
   `favoritedMistakeIds` says which ones are already in Volt Tracker.

### Practicing a mistake (Volt Tracker)

1. `GET /http/volt-tracker?type=mistake`. Each item has `moveSequence` (the position and the correct move) and `volt`
   (score, latest attempt and the values the attempt route needs).
2. Set up the board from `moveSequence.initialFen`. The player has to find `moveSequence.moves`, the engine's best move
   in UCI. It is always one move for mistakes. The game analysis screen also accepts the critical moment's
   `alternativeUci` when it exists (`GET /http/game-analysis/{gameId}`, moment with the same `ply`).
3. Record the attempt against `volt.sequenceId`. This is the same flow the web uses for puzzles:
   - start: `POST /http/move-sequence/{sequenceId}/attempt` `{ "status": "started" }` → `attemptId`
   - first wrong move: same route with `status: "failed"` and the counters so far. The attempt stays open.
   - solved: same route with `status: "completed"`, the final counters and
     `voltScore: { totalMoveCount: volt.totalMoveCount, rating: volt.rating }`. The response contains the new
     `VoltScoreResult`; replace `volt.score` with it.
   - left without solving: `status: "abandoned"`.
4. Do not call `PATCH /http/profile/rating` for mistakes. Only puzzles change the rating (that route answers `404`).

### Deleting the account

`DELETE /http/account`, then clear the local session with `supabase.auth.signOut({ scope: "local" })`. The user's
tokens stop working right away.

---

## Profile

### GET /http/profile

The profile the web profile page shows, including onboarding state and ratings. If the user has no `profiles` row yet,
the server creates it first.

- **Auth:** required
- **Request:** none
- **Success `data`:** [`UserProfileData`](#userprofiledata)

| Status | `error`             |
| ------ | ------------------- |
| 401    | `Unauthorized`      |
| 404    | `Profile not found` |

```bash
curl -s "$API/http/profile" -H "Authorization: Bearer $TOKEN"
```

### PATCH /http/profile/username

Change the display name. Same rules as the web profile form.

- **Auth:** required
- **Body:**

```ts
type UpdateUsernameBody = {
  username: string; // trimmed; 1–50 characters after trimming
};
```

- **Success `data`:** `{ username: string }`, the saved (trimmed) value

| Status | `error`                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------- |
| 400    | `username must be a string` · `Username is required.` · `Username must be 50 characters or fewer.` |
| 401    | `Unauthorized`                                                                                     |
| 500    | `Could not update username. Please try again.`                                                     |

```bash
curl -s -X PATCH "$API/http/profile/username" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"username":"Magnus Fan"}'
```

### PATCH /http/profile/platform-usernames

Link or unlink the Chess.com and Lichess accounts. Both fields are required, because the server writes both columns
together. Send the current value for the one you are not changing. Usernames are not checked against Chess.com or
Lichess here; onboarding does check them.

- **Auth:** required
- **Body:**

```ts
type UpdatePlatformUsernamesBody = {
  chesscomUsername: string | null; // trimmed; "" or null unlinks; max 50 characters
  lichessUsername: string | null; // trimmed; "" or null unlinks; max 50 characters
};
```

- **Success `data`:** `{ chesscomUsername: string | null; lichessUsername: string | null }`, the saved values

| Status | `error`                                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------ |
| 400    | `chesscomUsername and lichessUsername are required (string or null)` · `Usernames must be 50 characters or fewer.` |
| 401    | `Unauthorized`                                                                                                     |
| 500    | `Could not update linked accounts. Please try again.`                                                              |

```bash
curl -s -X PATCH "$API/http/profile/platform-usernames" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"chesscomUsername":"hikaru","lichessUsername":null}'
```

### PATCH /http/profile/rating

Moves `currentRating` by **+5** (`success`) or **−5** (`failure`) after a puzzle. Not part of mobile v1; it exists for
puzzles.

Rules:

- Only puzzle sequences change the rating. Other sequences, including game mistakes, answer `404`.
- Each puzzle changes the rating at most once per user. A puzzle counts as rated once any attempt on it has a wrong
  move, or has been completed without one.
- Call it **before** saving the attempt as `failed` / `completed`. Otherwise the saved attempt blocks the rating.
  The web calls it on the first wrong move (`failure`), or on a solve without wrong moves (`success`).

- **Auth:** required
- **Body:**

```ts
type UpdateRatingBody = {
  sequenceId: string; // UUID of the puzzle's move sequence (puzzle.moveSequence.id)
  outcome: "success" | "failure";
};
```

- **Success `data`:**

```ts
type UpdateProfileRatingResult = {
  updated: boolean; // false when nothing changed
  currentRating: number | null; // rating after the call
  skippedReason?: "already_rated"; // set when updated is false because the puzzle already counted
};
```

| Status | `error`                                                                |
| ------ | ---------------------------------------------------------------------- |
| 400    | `sequenceId must be a UUID` · `outcome must be "success" or "failure"` |
| 401    | `Unauthorized`                                                         |
| 404    | `No puzzle uses this sequence; only puzzles change the rating.`        |

```bash
curl -s -X PATCH "$API/http/profile/rating" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"sequenceId":"<puzzle moveSequence.id>","outcome":"success"}'
```

---

## Onboarding

### POST /http/onboarding/complete

Finishes onboarding and sets `initialRating` and `currentRating`.

- With at least one username, the rating comes from that platform. The server uses the time control with the most
  games, prefers rapid on ties, and takes the higher rating if both platforms are given. Every given account has to
  resolve. The rating is clamped to 100–3000.
- With no usernames (the "skip" path), the rating is **1500**.
- Given usernames are saved as linked accounts.
- It can only run once. A second call answers `409` and leaves the rating alone.

- **Auth:** required
- **Body:**

```ts
type CompleteOnboardingBody = {
  chesscomUsername?: string | null; // omit, null or "" to skip
  lichessUsername?: string | null;
};
```

- **Success `data`:**

```ts
type CompleteOnboardingData = {
  onboardingCompleted: true;
  profile: UserProfileData | null; // the updated profile (null only if reading it back failed)
};
```

The `422`, `429` and `502` messages are written for the user and can be shown as they are.

| Status | `error`                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------- |
| 400    | `chesscomUsername and lichessUsername must be strings of 50 characters or fewer, or null`             |
| 401    | `Unauthorized`                                                                                        |
| 409    | `Onboarding is already completed.`                                                                    |
| 422    | `We could not find that Chess.com username. Check the spelling or skip this step.` (same for Lichess) |
| 422    | `That Chess.com account has no usable rating yet. Try another platform or skip this step.`            |
| 429    | `Chess.com is handling too many requests right now. Wait a moment and try again.`                     |
| 502    | `Could not reach Chess.com right now. Try again later or skip this step.`                             |
| 500    | `Could not finish onboarding. Please try again.`                                                      |

```bash
curl -s -X POST "$API/http/onboarding/complete" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"chesscomUsername":"hikaru","lichessUsername":null}'
```

---

## Game analysis

Analyses and mistakes are stored per user and game id. Stored rows always have `source: "chesscom"`, Lichess games
included, so do not use `source` to tell platforms apart.

### GET /http/game-analysis/chesscom-games

Recent Chess.com games of any Chess.com username, newest first, 10 per page.

- **Auth:** required
- **Query:**

```ts
type ChessComGamesQuery = {
  username: string; // required
  offset?: number; // integer 0–500, default 0; use 10, 20, … for the next pages
};
```

- **Success `data`:** `{ games: PlatformGame[]; hasMore: boolean }` ([`PlatformGame`](#platformgame)). Use
  `game.uuid` as the game id.

| Status  | `error`                                                                                  |
| ------- | ---------------------------------------------------------------------------------------- |
| 400     | `username is required` · `offset must be a non-negative integer`                         |
| 401     | `Unauthorized`                                                                           |
| 4xx/502 | Chess.com error passed through (for example 404 for an unknown username, 429 rate limit) |

```bash
curl -s "$API/http/game-analysis/chesscom-games?username=hikaru&offset=0" -H "Authorization: Bearer $TOKEN"
```

### GET /http/game-analysis/lichess-games

The 10 most recent Lichess games of a username. There is no paging.

- **Auth:** required
- **Query:** `{ username: string }` (required)
- **Success `data`:** `{ games: LichessGame[]; hasMore: boolean }` ([`LichessGame`](#lichessgame)). These are raw
  Lichess objects; use `game.id` as the game id. The web maps them as follows (`mapLichessGame` in
  `features/game-analysis/utilities/map-lichess-game.ts`):
  - skip games without `pgn` or with a `variant` other than `"standard"`
  - `url = https://lichess.org/{id}`
  - player name = `players.white.user.name ?? players.white.user.id ?? "AI level {aiLevel}"`
  - `end_time = floor((lastMoveAt ?? createdAt) / 1000)`

| Status  | `error`                      |
| ------- | ---------------------------- |
| 400     | `username is required`       |
| 401     | `Unauthorized`               |
| 4xx/502 | Lichess error passed through |

```bash
curl -s "$API/http/game-analysis/lichess-games?username=DrNykterstein" -H "Authorization: Bearer $TOKEN"
```

### GET /http/game-analysis/{gameId}

The saved analysis of one game: the same data the web game-analysis page loads.

- **Auth:** required
- **Path:** `gameId`, the Chess.com `uuid` or the Lichess `id` (URL-encode it)
- **Success `data`:** [`GameAnalysisWithMistakes`](#gameanalysiswithmistakes), or `null` when the game has not been
  analyzed yet. That `null` is still a `200`.

| Status | `error`                                                         |
| ------ | --------------------------------------------------------------- |
| 400    | `gameId is required` · `gameId must be 100 characters or fewer` |
| 401    | `Unauthorized`                                                  |

```bash
curl -s "$API/http/game-analysis/1f0a2c3e-4b5d-11ef-8a7b-6cfe544c0428" -H "Authorization: Bearer $TOKEN"
```

### POST /http/game-analysis/analyze-game/stockfish

Saves an analysis computed on the device, creates the mistakes for `username`'s moves, and returns the same shape as
`GET /http/game-analysis/{gameId}`. Calling it again for the same game replaces the analysis.

The server validates the analysis strictly. For results that match the web, port the web's pipeline:

- `features/game-analysis/utilities/analyze-pgn-with-stockfish.ts`: Stockfish passes, depth 14 scan, depth 20 verify,
  MultiPV alternatives
- `features/game-analysis/utilities/get-critical-moments.ts`: which moves become critical moments
- `lib/utils/getMoveQuality.ts`: win-percent based mistake / miss / blunder classification
- `lib/chess/getMovesFromPgn.ts`: move list, `ply` and `fenBefore`

There is no server-side engine. The web runs Stockfish 19 lite (WASM, single-threaded) from the web repo's
`public/stockfish/` folder, served at `/stockfish/stockfish-19-lite-single.js` and `.wasm`. The app can run the same
files in a hidden WebView or ship a native Stockfish build.

- **Auth:** required
- **Body:**

```ts
type SaveLocalAnalysisBody = {
  gameId: string; // Chess.com uuid or Lichess id, at most 100 characters
  pgn: string; // full PGN of the game, at most 100 000 characters and 1 000 half-moves
  analysis: GameAnalysisResponseData;
  username?: string; // the player's name in this PGN, at most 50 characters; without it no mistakes are created
};

// features/game-analysis/types/game-analysis-response-data.ts
type GameAnalysisResponseData = {
  moveCount: number; // must equal the number of half-moves in the PGN
  depth: number; // 1–30
  criticalMoments: CriticalMoment[]; // at most moveCount and at most 200 items, one per ply
};
```

Each critical moment must describe a move of this PGN:

- integer `ply` of a move in the PGN (0-based half-move index), at most one moment per `ply`
- `fen`: the position before that move. Board, side to move and castling rights must match the PGN; the en passant
  field may differ. The server stores the PGN's own FEN.
- `playedUci`: the move played at that `ply`, and `turn` the side that played it
- `bestUci`: a legal UCI move in that position (`e2e4`, `e7e8q`), or `""` when the engine had none (no mistake is
  created then)
- `quality` of `"mistake"`, `"miss"` or `"blunder"`. **`"inaccuracy"` is rejected.**
- `mate` as a number or `null`; numeric `beforeCp` / `afterCp` / `deltaCp`
- `playedSan` / `bestSan` of at most 10 characters

`alternativeUci` and `alternativeSan` are optional. When sent, both must be present, the move must be legal in the
position, it must differ from `bestUci` and `playedUci`, and the SAN must match. Other fields are dropped. See
[`CriticalMoment`](#criticalmoment).

- **Success `data`:** [`GameAnalysisWithMistakes`](#gameanalysiswithmistakes)

| Status | `error`                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 400    | `gameId is required` · `gameId must be 100 characters or fewer` · `pgn is required` · `pgn must be 100000 characters or fewer`                   |
| 400    | `username must be 50 characters or fewer` · `Invalid or empty PGN` · `Games longer than 1000 plies are not supported` · `Invalid local analysis` |
| 401    | `Unauthorized`                                                                                                                                   |
| 500    | `Failed to save game analysis`                                                                                                                   |

```bash
curl -s -X POST "$API/http/game-analysis/analyze-game/stockfish" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d @- <<'JSON'
{
  "gameId": "example-game-1",
  "username": "MyChessName",
  "pgn": "[White \"MyChessName\"]\n[Black \"Opponent\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7# 1-0",
  "analysis": {
    "moveCount": 7,
    "depth": 20,
    "criticalMoments": [
      {
        "ply": 2,
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "playedUci": "f1c4", "playedSan": "Bc4",
        "bestUci": "g1f3", "bestSan": "Nf3",
        "beforeCp": 30, "afterCp": -80, "deltaCp": -110,
        "quality": "mistake", "mate": null, "turn": "w"
      }
    ]
  }
}
JSON
```

### GET /http/game-analysis/analyze-game?gameId=

The older form of `GET /http/game-analysis/{gameId}`, still used by the web. Same response and errors. Prefer the
path form.

---

## Volt Tracker

### GET /http/volt-tracker

The user's Volt Tracker items, each with its Volt score: the data the web Volt Tracker page shows.

- Sorted by `createdAt`, oldest first. The web lists pinned items first, then newest first.
- Volt only counts **completed** attempts from the last 3 months. A sequence scores its 4 most recent play days, up to
  250 per day, for a maximum of 1000. Each day uses its best 3 solves weighted 0.5 / 0.3 / 0.2 (fewer solves leave the
  missing weights at 0), and each solve scores 60% accuracy + 30% speed against `rating` + 10% streak. The web repo's
  `docs/volt-calculator.md` has the details.
- `volt.score` is computed by the server. Display it; there is nothing to compute on the device.

- **Auth:** required
- **Query:**

```ts
type VoltTrackerQuery = {
  type?: "mistake" | "puzzle" | "opening"; // omit for all items
};
```

- **Success `data`:** [`VoltTrackerFavorite[]`](#volttrackerfavorite). For `type: "mistake"` items, the fields to use
  are `gameAnalysisMistake`, `positionFen`, `moveSequence` and `volt`.

| Status | `error`                                         |
| ------ | ----------------------------------------------- |
| 400    | `type must be one of: mistake, puzzle, opening` |
| 401    | `Unauthorized`                                  |

```bash
curl -s "$API/http/volt-tracker?type=mistake" -H "Authorization: Bearer $TOKEN"
```

### POST /http/favorites/toggle

Adds the item to Volt Tracker, or removes it if it is already there.

- **Auth:** required
- **Body:** exactly one of the three ids (UUID)

```ts
type ToggleFavoriteBody =
  | { gameAnalysisMistakeId: string } // GameAnalysisMistake.id (questions[i].id)
  | { puzzleId: string }
  | { openingVariantId: string };
```

- **Success `data`:**

```ts
type ToggleFavoriteData = {
  favorited: boolean; // true = now in Volt Tracker
  favorite: UserFavorite | null; // the created row; null after removal
};
```

| Status | `error`                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | `Provide exactly one of openingVariantId, puzzleId or gameAnalysisMistakeId (UUID)` · `This item could not be added to Volt Tracker.` |
| 401    | `Unauthorized`                                                                                                                        |
| 404    | `This item does not exist.` (unknown id, or a game mistake of another user)                                                           |
| 500    | `Could not update Volt Tracker. Please try again.`                                                                                    |

```bash
curl -s -X POST "$API/http/favorites/toggle" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"gameAnalysisMistakeId":"<questions[i].id>"}'
```

---

## Practice attempts

An attempt is one try at a move sequence: a puzzle, an opening variant or a game mistake. Volt is built from
completed attempts. The usual lifecycle is `started` → (`failed` on the first wrong move) → `completed` or
`abandoned`, always updating the same `attemptId`.

Counters, all optional and sent as totals for the attempt so far:

| Field              | Meaning                                                     |
| ------------------ | ----------------------------------------------------------- |
| `durationMs`       | Time from the start of the attempt                          |
| `correctMoveCount` | Correct player moves                                        |
| `wrongMoveCount`   | Wrong tries                                                 |
| `hintCount`        | Hints used                                                  |
| `maxCorrectStreak` | Longest run of correct moves without a wrong one in between |

### POST /http/move-sequence/{sequenceId}/attempt

- **Auth:** required
- **Path:** `sequenceId`, `volt.sequenceId` / `moveSequence.id`
- **Body:**

```ts
// Start a new attempt
type StartAttemptBody = { status: "started" };

// Update or finish an existing attempt
type UpdateAttemptBody = {
  attemptId: string;
  status: "started" | "failed" | "completed" | "abandoned"; // failed / completed / abandoned set completedAt
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
  // Only with status "completed": returns the Volt score after this attempt.
  // Use volt.totalMoveCount and volt.rating from GET /http/volt-tracker.
  voltScore?: { totalMoveCount: number; rating: number };
};
```

- **Success `data`** (note the nested `success`):

```ts
type StartAttemptData = { success: true; attemptId: string };

type UpdateAttemptData = {
  success: true;
  attemptId: string;
  voltScore?: VoltScoreResult | null; // only for "completed"; null when voltScore was not sent
};
```

| Status | `error`                                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 400    | `attemptId is required to update a sequence attempt` · `Invalid attempt status` · `Sequence attempt does not match sequence` |
| 401    | `Unauthorized`                                                                                                               |
| 404    | `Sequence attempt not found` (unknown id or another user's attempt)                                                          |
| 500    | `Failed to start sequence attempt` · `Failed to complete sequence attempt` · `Failed to update sequence attempt`             |

```bash
# start
curl -s -X POST "$API/http/move-sequence/$SEQUENCE_ID/attempt" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"status":"started"}'

# complete, with the Volt score in the response
curl -s -X POST "$API/http/move-sequence/$SEQUENCE_ID/attempt" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"attemptId":"'"$ATTEMPT_ID"'","status":"completed","durationMs":4200,"correctMoveCount":1,"wrongMoveCount":0,"hintCount":0,"maxCorrectStreak":1,"voltScore":{"totalMoveCount":1,"rating":1600}}'
```

### POST /http/user-sequence-attempt/{attemptId}/event

Optional analytics log of what happened inside an attempt. Volt does not use it.

- **Auth:** required
- **Path:** `attemptId`
- **Body:**

```ts
type AttemptEventBody = {
  eventType: "start" | "move" | "hint" | "complete" | "abandoned";
  moveUci?: string | null; // for "move": the move played
  expectedUci?: string | null; // the correct move at that point
  isCorrect?: boolean | null; // for "move"
  hintLevel?: 1 | 2 | 3 | null; // for "hint"
  timeFromStartMs?: number | null;
};
```

- **Success `data`:** `{ success: true; eventId: string }` (nested `success`, as above)

| Status | `error`                                     |
| ------ | ------------------------------------------- |
| 400    | `Invalid event type` · `Invalid hint level` |
| 401    | `Unauthorized`                              |
| 404    | `Sequence attempt not found`                |
| 500    | `Failed to record sequence attempt event`   |

```bash
curl -s -X POST "$API/http/user-sequence-attempt/$ATTEMPT_ID/event" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"eventType":"move","moveUci":"g1f3","expectedUci":"g1f3","isCorrect":true,"timeFromStartMs":1500}'
```

---

## Account

### DELETE /http/account

Permanently deletes the user and all of their data: profile, rating, Volt Tracker, analyses, mistakes and attempts.
This cannot be undone, so ask the user to confirm first. Afterwards the access and refresh tokens no longer work; call
`supabase.auth.signOut({ scope: "local" })` and go back to the sign-in screen. Admin accounts cannot be deleted.

- **Auth:** required
- **Request:** none
- **Success `data`:** `{ deleted: true }`

| Status | `error`                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------- |
| 401    | `Unauthorized`                                                                                             |
| 403    | `Admin accounts cannot be deleted. Remove the admin role from this account first.`                         |
| 500    | `Could not delete your account. Please try again.` (also when the database blocks it; see the notes below) |
| 503    | `Account deletion is not available right now.` (the server is missing its Supabase service key)            |

```bash
curl -s -X DELETE "$API/http/account" -H "Authorization: Bearer $TOKEN"
```

---

## Types

Copied from the web repo. The path above each type is its source.

### UserProfileData

```ts
// features/profile/types/user-profile.ts
type UserProfileData = {
  username: string | null; // display name
  email: string | null;
  avatarUrl: string | null; // from the OAuth provider, if any
  role: "user" | "admin";
  onboardingCompleted: boolean;
  initialRating: number | null; // set by onboarding (100–3000)
  currentRating: number | null; // moves ±5 per rated puzzle
  chesscomUsername: string | null;
  lichessUsername: string | null;
};
```

### PlatformGame

```ts
// features/game-analysis/types/platform-game.ts (+ game-player.ts, chesscom-game-accuracies.ts)
type PlatformGame = {
  source: "chesscom" | "lichess";
  url: string;
  pgn: string;
  time_control: string;
  end_time: number; // unix seconds
  rated: boolean;
  fen: string; // final position
  time_class: string; // "rapid" | "blitz" | "bullet" | "daily" …
  rules: string; // "chess"
  white: GamePlayer;
  black: GamePlayer;
  accuracies?: { white: number; black: number };
  tournament?: string;
  match?: string;
  uuid: string; // game id for the analysis endpoints
};

type GamePlayer = {
  username: string;
  rating: number | null;
  result: string; // "win" | "checkmated" | "resigned" | "timeout" | "agreed" | …
};
```

### LichessGame

```ts
// lib/lichess/types.ts
type LichessGame = {
  id: string; // game id for the analysis endpoints
  rated: boolean;
  variant?: string; // only "standard" games can be analyzed
  speed?: string;
  perf?: string;
  createdAt?: number; // unix ms
  lastMoveAt?: number; // unix ms
  status?: string;
  winner?: "white" | "black";
  players?: { white?: LichessGamePlayer; black?: LichessGamePlayer };
  pgn?: string;
};

type LichessGamePlayer = {
  user?: { name?: string; id?: string };
  rating?: number;
  ratingDiff?: number;
  aiLevel?: number;
};
```

### CriticalMoment

```ts
// features/game-analysis/types/critical-moment.ts
type CriticalMoment = {
  ply: number; // 0-based half-move index in the game; fen is the position before this move
  fen: string;
  playedUci: string; // the move that was played
  playedSan: string;
  bestUci: string; // the engine's best move
  bestSan: string;
  alternativeUci?: string; // a second engine move that also counts as correct (newer analyses only)
  alternativeSan?: string;
  beforeCp: number; // centipawns for the side to move, before the move (mate as a large synthetic value)
  afterCp: number; // the same, after the move
  deltaCp: number; // afterCp - beforeCp
  quality: "inaccuracy" | "mistake" | "miss" | "blunder"; // saved analyses only contain mistake / miss / blunder
  mate: number | null; // mate-in-N before the move, if any
  turn: "w" | "b"; // who played the move
};
```

### GameAnalysisMistake

One mistake of the player, created from a critical moment of their color. Volt Tracker stores these.

```ts
// features/game-analysis-mistakes/types/game-analysis-mistake.ts
type GameAnalysisMistake = {
  id: string; // use as gameAnalysisMistakeId
  userId: string;
  gameAnalysisId: string | null;
  moveSequenceId: string | null; // the practice sequence (position + best move)
  gameId: string;
  source: string; // always "chesscom", see "Game analysis"
  title: string; // "Played Bc4"
  ply: number; // matches CriticalMoment.ply
  quality: "mistake" | "blunder"; // a "miss" moment is saved as "mistake"
  createdAt: string;
  updatedAt: string;
};
```

### GameAnalysisWithMistakes

```ts
// features/game-analysis/types/game-analysis-with-mistakes.ts
type GameAnalysisWithMistakes = {
  moveCount: number; // half-moves in the game
  criticalMoments: CriticalMoment[]; // both colors
  questions: GameAnalysisMistake[]; // the analyzed player's mistakes, by ply
  favoritedMistakeIds: string[]; // ids from `questions` that are in Volt Tracker
};
```

### MoveSequence

```ts
// features/move-sequence/types/move-sequence.ts
type MoveSequence = {
  id: string; // the sequenceId for attempts
  initialFen: string; // starting position
  moves: string; // space-separated UCI moves; for a mistake: the single best move, e.g. "g1f3"
  goals: MoveGoals | null; // opening variants only (features/move-sequence/types/move-goal.ts)
  pgn: string | null;
  displayFen: string | null;
  createdAt: string;
  updatedAt: string;
};
```

For puzzles and openings, `moves` alternates the player's moves and the opponent's replies, starting with the player.
The player has to find indices 0, 2, 4, …

### UserFavorite

```ts
// features/user-favorites/types/user-favorite.ts
type UserFavorite = {
  id: string;
  userId: string;
  openingVariantId: string | null; // exactly one of these three is set
  puzzleId: string | null;
  gameAnalysisMistakeId: string | null;
  isPinned: boolean;
  note: string | null;
  createdAt: string;
};

type UserFavoriteWithDetails = UserFavorite & {
  openingVariant: OpeningVariant | null;
  opening: { id: string; slug: string | null; name: string } | null;
  puzzle: Puzzle | null;
  gameAnalysisMistake: GameAnalysisMistake | null;
  positionFen: string | null; // mistakes: the position before the mistake (CriticalMoment.fen)
};
```

### VoltTrackerFavorite

```ts
// features/user-favorites/types/volt-tracker.ts
type VoltTrackerFavorite = UserFavoriteWithDetails & {
  type: "mistake" | "puzzle" | "opening";
  moveSequence: MoveSequence | null; // the sequence that is practiced and scored
  volt: VoltTrackerVolt | null; // null when there is no sequence to score
};

type VoltTrackerVolt = {
  sequenceId: string; // path param of the attempt route
  totalMoveCount: number; // send as voltScore.totalMoveCount (1 for mistakes)
  rating: number; // send as voltScore.rating (1600 for mistakes)
  score: VoltScoreResult;
  latestAttempt: SequenceAttemptStats | null; // null = never attempted
};
```

### VoltScoreResult

```ts
// components/calculator/volt-calculator/volt.types.ts
type VoltScoreResult = {
  volt: number; // 0–maxVolt
  maxVolt: number; // 1000
  lookbackMonths: number; // 3
  scoredDayCount: number; // 4
  bestAttemptsCounted: number; // 3 solves per day count
  days: VoltDaySlot[]; // always scoredDayCount slots
};

type VoltDaySlot = {
  slotIndex: number;
  date: string | null; // null for an unplayed slot
  dayVolt: number;
  dayMaxVolt: number; // 250
  isPlayed: boolean;
  attempts: VoltAttemptBreakdown[]; // every completed solve that day, oldest first
};

type VoltAttemptBreakdown = {
  attemptId: string;
  attemptIndex: number; // 1-based order within the day
  rank: number; // 1 = best of the day
  isCounted: boolean; // one of the day's best solves
  startedAt: string;
  accuracyPercent: number;
  timingPercent: number;
  streakPercent: number;
  attemptScore: number;
  attemptWeight: number; // 0 when not counted
  weightedContribution: number;
};
```

### SequenceAttemptStats

```ts
// features/user-sequence-attempt/types/user-sequence-attempt.ts
type SequenceAttemptStats = {
  sequenceId: string;
  status: "started" | "completed" | "abandoned" | "failed";
  isCompleted: boolean;
  correctMoveCount: number;
  wrongMoveCount: number;
  hintCount: number;
  maxCorrectStreak: number;
  durationMs: number | null;
};
```

The web shows a solved mark for `status: "completed"` and a failed mark for `status: "failed"`.

### Puzzle, OpeningVariant

Only needed for `puzzle` / `opening` items.

```ts
// features/puzzle/types/puzzle.ts
type Puzzle = {
  id: string;
  gameId: string | null;
  sourceId: string | null;
  source: string | null;
  title: string;
  rating: number | null;
  popularity: number | null;
  isActive: boolean;
  moveSequence: MoveSequence;
  createdAt: string;
};

// features/openings/types/opening-variant.ts
type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: number;
  title: string | null;
  description: string | null;
  initialPly: number;
  moveSequence: MoveSequence;
  createdAt: string;
};
```

---

## Notes and limitations

- **Account deletion needs a database migration.** `DELETE /http/account` relies on
  `supabase/migrations/20261123140000_cascade_user_data_on_account_delete.sql` (ON DELETE CASCADE on the user
  tables). Until that migration is applied, the call answers `500`. Admin accounts are refused with `403`; only admins
  write blog posts, and `blog_posts.author_id` stays `RESTRICT`.
- **The rating only changes through puzzles.** Game mistakes do not change it; see `PATCH /http/profile/rating`.
- **The web's page cache is not refreshed by the API.** The web Server Actions call `revalidatePath` after changes;
  the API routes do not. The only page this affects is an opening variant page after an opening favorite is toggled
  from mobile, and mobile v1 does not toggle openings.
- **The game lists accept any username.** They are not limited to the user's linked accounts.
