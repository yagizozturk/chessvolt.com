├── README.md
├── api-client
│   ├── client.ts
│   └── route-handler.ts
├── app
│   ├── (admin)
│   │   ├── admin
│   │   │   ├── game-riddles
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actions.ts
│   │   │   │   ├── game-riddle-detail.tsx
│   │   │   │   ├── game-riddle-form.tsx
│   │   │   │   ├── game-riddles-list.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── games
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actions.ts
│   │   │   │   ├── game-detail.tsx
│   │   │   │   ├── game-form.tsx
│   │   │   │   ├── games-list.tsx
│   │   │   │   ├── import
│   │   │   │   │   ├── actions.ts
│   │   │   │   │   ├── import-pgn-form.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── openings
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actions.ts
│   │   │   │   ├── edit
│   │   │   │   │   └── [id]
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── opening-actions.ts
│   │   │   │   ├── opening-edit-form.tsx
│   │   │   │   ├── opening-form.tsx
│   │   │   │   ├── openings-list.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── parent-openings-list.tsx
│   │   │   │   ├── variant-detail.tsx
│   │   │   │   └── variant-form.tsx
│   │   │   ├── page.tsx
│   │   │   ├── puzzles
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (auth)
│   │   ├── auth
│   │   │   └── callback
│   │   │   └── route.ts
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   └── signup
│   │   └── page.tsx
│   ├── (dashboard)
│   │   ├── challenge
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── game-riddle
│   │   │   └── [id]
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── openings
│   │   │   ├── [slug]
│   │   │   │   └── [id]
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── variant
│   │   │   └── [id]
│   │   │   └── page.tsx
│   │   ├── play
│   │   │   └── page.tsx
│   │   └── puzzle
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── (marketing)
│   │   ├── challenge-preview
│   │   │   └── [slug]
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── http
│   │   ├── chat
│   │   │   └── route.ts
│   │   ├── game-riddle
│   │   │   └── [id]
│   │   │   └── solve
│   │   │   └── route.ts
│   │   ├── profile
│   │   │   └── reward
│   │   │   └── route.ts
│   │   └── puzzle
│   │   ├── [id]
│   │   │   └── solve
│   │   │   └── route.ts
│   │   └── getCoach
│   │   └── route.ts
│   ├── layout.tsx
│   └── storybook
│   └── page.tsx
├── assets
│   ├── chessground.css
│   ├── images
│   │   ├── board
│   │   │   ├── blue.svg
│   │   │   ├── marble.jpg
│   │   │   └── turq.jpg
│   │   └── pieces
│   │   ├── cardinal
│   │   │   ├── bB.svg
│   │   │   ├── bK.svg
│   │   │   ├── bN.svg
│   │   │   ├── bP.svg
│   │   │   ├── bQ.svg
│   │   │   ├── bR.svg
│   │   │   ├── wB.svg
│   │   │   ├── wK.svg
│   │   │   ├── wN.svg
│   │   │   ├── wP.svg
│   │   │   ├── wQ.svg
│   │   │   └── wR.svg
│   │   └── merida
│   │   ├── bB.svg
│   │   ├── bK.svg
│   │   ├── bN.svg
│   │   ├── bP.svg
│   │   ├── bQ.svg
│   │   ├── bR.svg
│   │   ├── wB.svg
│   │   ├── wK.svg
│   │   ├── wN.svg
│   │   ├── wP.svg
│   │   ├── wQ.svg
│   │   └── wR.svg
│   ├── theme
│   │   └── theme.css
│   └── volt.css
├── components
│   ├── collection
│   │   └── collection-header.tsx
│   ├── countdown-timer
│   │   └── countdown-timer.tsx
│   ├── game
│   │   ├── navbar.tsx
│   │   ├── stat-item.tsx
│   │   └── user-stats.tsx
│   ├── puzzle-card
│   │   └── puzzle-card.tsx
│   ├── stats
│   │   ├── number-stats-card.tsx
│   │   └── progress-stats-card.tsx
│   ├── theme-provider
│   │   └── theme-provider.tsx
│   └── ui
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dropdown-menu.tsx
│   ├── field.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── navigation-menu.tsx
│   ├── scroll-area.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── tabs.tsx
│   └── theme-toggle.tsx
├── components.json
├── docs
│   ├── archtecture.md
│   ├── challenge
│   │   ├── from-entries.md
│   │   └── what-is-Record.md
│   └── hardcoded-colors-audit.md
├── eslint.config.mjs
├── features
│   ├── admin
│   │   └── components
│   │   └── admin-navbar.tsx
│   ├── auth
│   │   └── components
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── challenge
│   │   └── components
│   │   └── challenge-data-list.tsx
│   ├── chat
│   │   ├── api
│   │   │   └── chat.ts
│   │   ├── hooks
│   │   │   └── use-chat-stream.ts
│   │   └── types
│   ├── coach
│   │   └── components
│   │   └── coach-stockfish.tsx
│   ├── game
│   │   ├── mapper
│   │   │   └── game.mapper.ts
│   │   ├── repository
│   │   │   └── game.repository.ts
│   │   ├── services
│   │   │   └── game.ts
│   │   ├── store
│   │   │   └── game-store.ts
│   │   └── types
│   │   └── game.ts
│   ├── game-riddle
│   │   ├── api
│   │   │   └── game-riddle.ts
│   │   ├── components
│   │   │   ├── riddle-card.tsx
│   │   │   └── riddle-controller.tsx
│   │   ├── hooks
│   │   │   └── use-update-game-riddle.ts
│   │   ├── mapper
│   │   │   └── game-riddle.mapper.ts
│   │   ├── repository
│   │   │   ├── game-riddle.repository.ts
│   │   │   └── user-game-riddle.repository.ts
│   │   ├── services
│   │   │   └── game-riddle.ts
│   │   ├── types
│   │   │   ├── game-riddle.ts
│   │   │   └── user-game-riddle.ts
│   │   └── utilities
│   │   ├── game-type-copy.ts
│   │   └── get-group-stats.ts
│   ├── home
│   │   ├── components
│   │   │   └── dashboard-navbar.tsx
│   │   └── store
│   │   └── stats-store.ts
│   ├── landing
│   │   └── components
│   │   ├── cta.tsx
│   │   ├── features.tsx
│   │   ├── footer.tsx
│   │   ├── hero-content.tsx
│   │   ├── hero.tsx
│   │   ├── navbar.tsx
│   │   └── pricing.tsx
│   ├── openings
│   │   ├── components
│   │   │   ├── opening-board-card.tsx
│   │   │   └── openings-controller.tsx
│   │   ├── mapper
│   │   │   └── opening-variant.mapper.ts
│   │   ├── repository
│   │   │   ├── opening-variant.repository.ts
│   │   │   └── opening.repository.ts
│   │   ├── services
│   │   │   └── openings.ts
│   │   ├── store
│   │   │   └── openings-store.ts
│   │   └── types
│   │   ├── opening-variant.ts
│   │   └── opening.ts
│   ├── playground
│   │   └── components
│   │   ├── board
│   │   │   ├── inactive-play-board.tsx
│   │   │   └── play-board.tsx
│   │   ├── difficulty-selector
│   │   │   └── difficulty-selector.tsx
│   │   ├── game-controller.tsx
│   │   ├── game-status-modal
│   │   │   └── game-status-modal.tsx
│   │   ├── group-selection
│   │   │   ├── group-selection-item.tsx
│   │   │   └── group-selection.tsx
│   │   └── piece-color-selector
│   │   └── piece-color-selector.tsx
│   ├── profile
│   │   ├── api
│   │   │   └── profile.ts
│   │   ├── components
│   │   ├── hooks
│   │   │   └── use-profile.ts
│   │   ├── repository
│   │   │   └── profile.repository.ts
│   │   ├── services
│   │   ├── store
│   │   └── types
│   └── puzzle
│   ├── api
│   │   └── puzzle.ts
│   ├── components
│   │   ├── puzzle-board.tsx
│   │   └── puzzle-controller.tsx
│   ├── hooks
│   │   ├── use-get-puzzle-coach.ts
│   │   └── use-update-puzzle.ts
│   ├── mapper
│   │   └── puzzle.mapper.ts
│   ├── repository
│   │   ├── puzzle.repository.ts
│   │   └── user-puzzle.repository.ts
│   ├── services
│   │   └── puzzle.ts
│   ├── store
│   └── types
│   └── puzzle.ts
├── hooks
│   └── use-counter.ts
├── lib
│   ├── chess
│   │   ├── createMoveFromUci.ts
│   │   ├── createMoveObjectsFromMultiPvs.ts
│   │   ├── extractMovesFromPgn.ts
│   │   ├── getFenFromPgnAtPly.ts
│   │   ├── getTurn.ts
│   │   ├── hooks
│   │   │   └── use-chess.ts
│   │   ├── movesToPgn.ts
│   │   ├── parsePgn.ts
│   │   └── toDests.ts
│   ├── chessground
│   │   └── hooks
│   │   └── use-chessgroud.ts
│   ├── engine
│   │   ├── createEngine.ts
│   │   ├── hooks
│   │   │   └── use-stockfish-engine.ts
│   │   └── parseEngine.ts
│   ├── open-ai
│   │   ├── ai.config.ts
│   │   ├── concate-prompt.ts
│   │   └── open-ai.ts
│   ├── shared
│   │   ├── constants
│   │   │   ├── opening-type-copy.ts
│   │   │   └── quote.ts
│   │   ├── hooks
│   │   │   ├── use-mobile.ts
│   │   │   └── use-sound.ts
│   │   ├── store
│   │   │   └── coach-store.ts
│   │   └── types
│   │   ├── engine-info.ts
│   │   ├── game-difficulty.ts
│   │   ├── game-status.ts
│   │   └── move.ts
│   ├── supabase
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── utilities
│   ├── cn.ts
│   ├── groupBy.ts
│   ├── reward.ts
│   ├── shuffle.ts
│   └── slugify.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── audio
│   │   ├── correct.mp3
│   │   ├── move.wav
│   │   ├── piece-move-sound.mp3
│   │   └── piece-move.mp3
│   ├── file.svg
│   ├── globe.svg
│   ├── images
│   │   ├── challanges
│   │   │   ├── legend_games2.png
│   │   │   └── magnus_morphy2.png
│   │   ├── features
│   │   │   ├── landing_page_features_game_1.png
│   │   │   ├── landing_page_features_game_2.png
│   │   │   └── landing_page_features_game_3.png
│   │   └── hero
│   │   └── landing_page_1.png
│   ├── next.svg
│   ├── stockfish.js
│   ├── vercel.svg
│   └── window.svg
├── supabase
│   └── migrations
│   └── 20250313000000_add_slug_to_openings.sql
└── tsconfig.json

158 directories, 241 files
