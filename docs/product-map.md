# ChessVolt Product Map

High-level map of what the app does, which routes users hit, and where the code lives. Use this to regain scope before refactoring.

Last updated: 2025-06-05

---

## What ChessVolt is

ChessVolt is a chess training app where users:

1. Sign up and complete onboarding
2. Browse curated **collections** of chess **riddles** (interactive move sequences from real games)
3. Play riddles on an interactive board, earn **volt scores**, and track progress
4. Practice **openings** via variants and arrow drills
5. Save riddles to **my collections** (custom collections)

Content is managed through an **admin** panel. Auth and data are backed by **Supabase**.

---

## User journeys

| Journey              | Routes                                                      | Feature folder(s)                                                                                                        | Notes                                           |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Landing / marketing  | `/`                                                         | `features/landing`                                                                                                       | Public homepage                                 |
| Contact              | `/contact`                                                  | `features/contact`                                                                                                       | Contact form → Supabase                         |
| Sign up / log in     | `/signup`, `/login`, `/forgot-password`, `/update-password` | `features/auth`                                                                                                          | Supabase auth                                   |
| Auth callback        | `/auth/callback`                                            | `lib/supabase`                                                                                                           | OAuth / email confirmation                      |
| Onboarding           | `/onboarding`                                               | `onboarding`, `onboarding-question`, `onboarding-option`, `onboarding-option-theme`, `user-onboarding-answer`, `profile` | Gated by middleware; creates starter collection |
| Browse collections   | `/collection`                                               | `collection`, `content-theme`, `theme`                                                                                   | Filterable list with themes                     |
| Collection detail    | `/collection/[slug]`                                        | `collection`, `riddle`, `riddle-collection`, `game`, `user-sequence-attempt`                                             | Riddle cards with progress + volt               |
| Play a riddle        | `/riddle/[id]`                                              | `riddle`, `move-sequence`, `user-sequence-attempt`, `user-sequence-attempt-event`, `riddle-collection`                   | Core play loop                                  |
| My collections       | `/my-collections`, `/my-collections/create`                 | `collection`, `user-practice-opening-variant`                                                                            | Custom collections + practice openings tabs     |
| Openings list        | `/openings`                                                 | `openings`                                                                                                               | Filter by opening type                          |
| Opening detail       | `/openings/[slug]/[id]`                                     | `openings`                                                                                                               | Variants for one opening                        |
| Play opening variant | `/openings/variant/[id]`                                    | `openings`, `move-sequence`, `user-sequence-attempt`, `user-practice-opening-variant`                                    | Same play loop as riddles                       |
| Arrows drill         | `/openings/arrows/[id]`                                     | `arrows`, `openings`                                                                                                     | Arrow-based opening training                    |

---

## Core play loop (shared by riddles & openings)

Most interactive training modes follow the same pipeline:

```
app route (page.tsx)
  → *-controller.tsx          (client UI orchestration)
  → use-move-sequence-controller   (move validation, board state)
  → use-sequence-attempt           (persist attempts, accuracy, completion)
  → VoltBoard                        (chessground board)
  → calculators (volt, accuracy, streak, rating-timing)
  → HTTP routes for attempt events
```

Key shared pieces:

| Layer                | Location                                                                   |
| -------------------- | -------------------------------------------------------------------------- |
| Board                | `components/boards/volt-board/`                                            |
| Move sequence logic  | `features/move-sequence/`                                                  |
| Attempt tracking     | `features/user-sequence-attempt/`, `features/user-sequence-attempt-event/` |
| Scoring              | `components/calculator/` (volt, accuracy, streak, rating-timing)           |
| Chess utilities      | `lib/chess/`                                                               |
| Engine (Stockfish)   | `lib/engine/`, `features/coach/`                                           |
| TTS (text-to-speech) | `features/tts/`                                                            |
| Chat (AI coach)      | `features/chat/`                                                           |

Entry points to trace first:

- `app/(dashboard)/riddle/[id]/page.tsx` → `features/riddle/components/riddle-controller.tsx`
- `app/(dashboard)/openings/variant/[id]/page.tsx` → `features/openings/components/opening-variant-controller.tsx`
- `app/(dashboard)/collection/[slug]/page.tsx` → collection list + attempt summaries

---

## HTTP API routes

| Route                                                       | Purpose                          |
| ----------------------------------------------------------- | -------------------------------- |
| `app/http/move-sequence/[sequenceId]/attempt/route.ts`      | Record move attempts during play |
| `app/http/user-sequence-attempt/[attemptId]/event/route.ts` | Attempt lifecycle events         |
| `app/http/chat/route.ts`                                    | AI chat stream                   |
| `app/http/tts/route.ts`                                     | Text-to-speech audio             |

---

## Feature folders (26 domains)

Each folder under `features/` is a domain module. Most data-backed features follow:

```
types/ → repository/ → mapper/ → services/ → components/ | hooks/ | actions/
```

| Folder                          | Responsibility                                     |
| ------------------------------- | -------------------------------------------------- |
| `arrows`                        | Arrow drill UI for openings                        |
| `auth`                          | Login / signup forms                               |
| `chat`                          | AI chat API + streaming hook                       |
| `coach`                         | Stockfish coach overlay                            |
| `collection`                    | Collections (curated + custom), filters, headers   |
| `contact`                       | Contact form + message storage                     |
| `content-theme`                 | Content theme links (collection ↔ theme weighting) |
| `game`                          | Chess games (PGN source for riddles)               |
| `home`                          | Dashboard navbar                                   |
| `landing`                       | Marketing pages (hero, features, footer)           |
| `move-sequence`                 | Move sequences, goals, play controller hook        |
| `onboarding`                    | Onboarding flow orchestration                      |
| `onboarding-option`             | Onboarding answer options                          |
| `onboarding-option-theme`       | Theme links for onboarding options                 |
| `onboarding-question`           | Onboarding questions                               |
| `openings`                      | Openings, variants, practice UI                    |
| `profile`                       | User profile + onboarding status                   |
| `riddle`                        | Riddles, board cards, play controller              |
| `riddle-collection`             | Many-to-many: riddles ↔ collections                |
| `theme`                         | Theme categories and badges                        |
| `tts`                           | Text-to-speech config, cache, controller           |
| `user-onboarding-answer`        | Saved onboarding answers per user                  |
| `user-practice-opening-variant` | User's saved opening variants                      |
| `user-sequence-attempt`         | Play attempts, accuracy, volt inputs               |
| `user-sequence-attempt-event`   | Granular attempt events                            |

---

## Shared `components/` (not feature-specific)

Reusable UI and chess primitives live at the project root:

| Folder                                         | Purpose                                           |
| ---------------------------------------------- | ------------------------------------------------- |
| `boards/`                                      | VoltBoard (chessground wrapper)                   |
| `calculator/`                                  | Volt, accuracy, streak, rating-timing calculators |
| `goal-viewer/`                                 | Move goal display during play                     |
| `ui/`                                          | shadcn/ui primitives                              |
| `stats/`, `notifier/`, `solve-success-dialog/` | Play feedback UI                                  |

Rule of thumb: domain UI → `features/{domain}/components`. Shared chess/UI → root `components/`.

---

## Admin panel (`/admin/*`)

| Section     | Routes                                       | Manages                                         |
| ----------- | -------------------------------------------- | ----------------------------------------------- |
| Dashboard   | `/admin`                                     | Overview                                        |
| Users       | `/admin/users`                               | User list                                       |
| Games       | `/admin/games/*`                             | PGN games (riddle source)                       |
| Riddles     | `/admin/riddles/*`                           | Create/edit/bulk riddles                        |
| Collections | `/admin/collections/*`                       | Curated collections                             |
| Themes      | `/admin/themes/*`, `/admin/content-themes/*` | Theme tags + content theme weights              |
| Onboarding  | `/admin/onboarding-*`                        | Questions, options, option themes, user answers |
| Openings    | `/admin/openings/*`                          | Openings + variants (bulk import)               |
| Storybook   | `/admin/storybook/*`                         | UI component previews                           |
| Refactor    | `/admin/refactor`                            | Refactor + docs review tracker                  |
| Test        | `/admin/test/*`                              | Dev playgrounds (board, joyride, PGN, etc.)     |

Admin pages live in `app/(admin)/admin/`. Business logic still comes from `features/*/services`.

---

## Auth & route gating

Onboarding redirects are handled in middleware:

- `middleware.ts` → delegates to `lib/supabase/middleware.ts`
- Route policy helpers → `features/onboarding/lib/onboarding-routes.ts`

See [onboarding-middleware-logic.md](./onboarding-middleware-logic.md) for details.

---

## Domain-specific docs

| Doc                                                                | Topic                        |
| ------------------------------------------------------------------ | ---------------------------- |
| [onboarding-middleware-logic.md](./onboarding-middleware-logic.md) | Onboarding redirects         |
| [content_themes_weight_logic.md](./content_themes_weight_logic.md) | Content theme weighting      |
| [themes_sort_order_logic.md](./themes_sort_order_logic.md)         | Theme sort order             |
| [theme-tokens-lightness-rank.md](./theme-tokens-lightness-rank.md) | Theme token lightness        |
| [colors.md](./colors.md)                                           | Color tokens                 |
| [structure.md](./structure.md)                                     | Landing page CSS class notes |

---

## Refactor status tracking

Use `/admin/refactor` to check off:

- **App routes** — `page.tsx`, `layout.tsx`, `loading.tsx`, and `route.ts` under `app/`
- **Components** — all `.tsx` files under `components/` folders
- **Docs** — all `.md` files under `docs/`

Mark items as reviewed/refactored as you work through vertical slices.
