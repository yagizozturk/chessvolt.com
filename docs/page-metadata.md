# Page titles and meta descriptions

`| ChessVolt` is part of each title once. There is no `title.template`.

Filled `study.description`, `theme.description`, `opening.description`, and `variant.description` are kept. The fallback is used only when that field is empty.

Missing or inactive studies and themes, and missing openings and variants, call `notFound()`. The dashboard 404 title is `Page Not Found | ChessVolt`.

## Static pages

### `/`

- Title: Chess Training: Openings, Puzzles & Game Analysis | ChessVolt
- Description: Learn chess openings, solve puzzles and analyze your games. Replay mistakes and reinforce what you learn with spaced repetition.

### `/studies`

- Title: Chess Studies & Puzzle Collections | ChessVolt
- Description: Explore curated chess puzzle studies. Work through instructive positions, practice finding the best moves and understand the ideas behind them.

### `/puzzles`

- Title: Chess Puzzles: Find the Best Move | ChessVolt
- Description: Solve a random chess puzzle and practice finding the best move. Test your calculation and sharpen your ability to spot tactical opportunities.

### `/openings`

- Title: Learn Chess Openings & Key Variations | ChessVolt
- Description: Learn chess openings from 1.e4 and 1.d4 to Indian defenses. Practice key variations move by move and understand the ideas behind your opening moves.

### `/game-analysis`

- Title: Chess Game Analysis for Chess.com & Lichess | ChessVolt
- Description: Analyze your Chess.com and Lichess games to find mistakes and missed opportunities. Review critical positions and learn from your own play.

## Dynamic pages

### `/studies/[slug]`

- Title: `{study.title}: Chess Study | ChessVolt`
- Empty title: Chess Study | ChessVolt
- Empty description: Explore {study.title}, an interactive chess study. Work through instructive positions and understand the ideas behind the moves.

### `/puzzles/theme/[slug]`

- Title: `{theme.title} Chess Puzzles | ChessVolt`
- Empty title: Themed Chess Puzzles | ChessVolt
- Empty description: Solve chess puzzles from the {theme.title} collection. Practice calculating moves and recognizing patterns you can use in your own games.

### `/openings/[slug]/[id]`

- Title: `{opening.name}: Moves & Variations | ChessVolt`
- Empty name: Chess Opening Training | ChessVolt
- Empty description: Learn the {opening.name} with interactive opening practice. Explore key variations, rehearse the moves and understand the ideas behind them.

### `/openings/variant/[id]`

- Title: `{variant.title} | ChessVolt`
- Generic title such as Main Line, when the parent opening name is known and not already in the variant title: `{opening.name}: {variant.title} | ChessVolt`
- Empty variant title with an opening name: `{opening.name}: Opening Practice | ChessVolt`
- Empty variant title and no opening name: Chess Opening Variation | ChessVolt
- Empty description: Practice {variant.title} move by move. Understand the key ideas behind this chess opening variation and reinforce the moves through repetition.
