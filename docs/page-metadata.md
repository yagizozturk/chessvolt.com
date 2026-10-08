# Page titles and meta descriptions

Pattern: `Title | ChessVolt`.

These are the current values. Rewrite the title and description for each page.

## Static pages

### `/`

Set in `app/layout.tsx`. The homepage has no metadata of its own.

- Title: ChessVolt | Chess Game Analysis & Opening Training
- Description: Analyze your Chess.com and Lichess games, replay mistakes, and practice chess openings and puzzles. Track your progress with Volt Tracker.
- On-page heading: Learn. Repeat. Play Better Chess
- On-page text: Learn openings, solve puzzles, play real famous games, and train with interactive chess games that aims to teach you the idea behind the moves.

### `/studies`

- Title: Studies | ChessVolt
- Description: Explore curated puzzle studies.
- On-page heading: Studies
- On-page text: Explore curated puzzle studies.

### `/puzzles`

- Title: Puzzles | ChessVolt
- Description: Solve a random puzzle.
- On-page heading: Puzzles
- On-page text: Solve a random puzzle.
- What it does: Loads one random active puzzle.

### `/openings`

- Title: Openings | ChessVolt
- Description: Learn openings from e4 and d4 to Indian setups.
- On-page heading: Learn Openings To Master The Game
- On-page text: From e4 openings to d4, indian setups

### `/game-analysis`

- Title: Game Analysis | ChessVolt
- Description: Analyze your Chess.com and Lichess games and find your mistakes.
- On-page heading: Analyze Your Chess.com and LichessGames
- On-page text: Analyze your chess.com and lichess.org games and find your mistakes.

## Dynamic pages

Title and description come from the record. Fallbacks are used when that field is empty, or when the record is missing.

### `/studies/[slug]`

- Title: `{study.title} | ChessVolt`
- Description: `{study.description}`
- Missing record title: Study | ChessVolt

### `/puzzles/theme/[slug]`

- Title: `{theme.title} | ChessVolt`
- Description: `{theme.description}`
- Fallback description: Practice chess puzzles in this theme.
- Missing record title: Puzzle Theme | ChessVolt

### `/openings/[slug]/[id]`

- Title: `{opening.name} | ChessVolt`
- Description: `{opening.description}`
- Fallback description: Learn this opening and its variations.
- Missing record title: Opening | ChessVolt

### `/openings/variant/[id]`

- Title: `{variant.title} | ChessVolt`
- Description: `{variant.description}`
- Fallback title: Opening variant | ChessVolt
- Fallback description: Practice this opening variation move by move.
- Missing record title: Opening Variant | ChessVolt
