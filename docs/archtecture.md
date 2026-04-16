├── api-client
│   ├── client.ts
│   └── route-handler.ts
├── app
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
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── game-riddle
│   │   │   └── [id]
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── openings
│   │   │   ├── [slug] ✅
│   │   │   │   └── [id] ✅
│   │   │   │   └── page.tsx ✅
│   │   │   ├── loading.tsx ✅
│   │   │   ├── page.tsx ✅
│   │   │   └── variant ✅
│   │   │   └── [id] ✅
│   │   │   └── page.tsx ✅
│ 
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
│   │   └── opening-variant
│   │   └── [id]
│   │   └── solve
│   │   └── route.ts
│   ├── layout.tsx
│   └── storybook
│   └── page.tsx
│   ├── theme
│   │   └── theme.css
│   └── volt.css
├── components
│   ├── board-status-icon
│   │   └── board-status-icon.tsx
│   ├── collection
│   │   └── collection-header.tsx
│   ├── game
│   │   ├── navbar.tsx
│   │   ├── stat-item.tsx
│   │   └── user-stats.tsx
│   ├── goal-stepper
│   │   └── goal-stepper.tsx
│   ├── informer-box
│   │   └── informer-box.tsx
│   ├── informer-label
│   │   └── informer-label.tsx
│   ├── informer-top
│   │   └── informer-top.tsx
│   ├── number-badge
│   │   └── number-badge.tsx
│   ├── sidebar
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx
│   │   └── nav-user.tsx
│   ├── solve-success-dialog
│   │   └── solve-success-dialog.tsx
│   ├── stats
│   │   ├── image-stats-card.tsx ✅
│   │   └── progress-stats-card.tsx
│   ├── success-overlay
│   │   └── success-overlay.tsx
│   ├── theme-provider
│   │   └── theme-provider.tsx
│   ├── variant-slider
│   │   └── variant-slider.tsx
│   └── volt-board
│   └── volt-board.tsx ✅
├── components.json
├── data
│   ├── london-goals.json
│   ├── london-system.json
│   ├── sidebar-challenges-nav.json
│   └── sidebar-openings-nav.json
├── docs
│   ├── archtecture.md
│   ├── challenge
│   │   ├── from-entries.md
│   │   └── what-is-Record.md
│   ├── hardcoded-colors-audit.md
│   └── pgn-teach.md
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
│   ├── dashboard
│   │   └── components
│   │   └── dashboard-header.tsx
│   ├── game
│   │   ├── mapper
│   │   │   └── game.mapper.ts
│   │   ├── repository
│   │   │   └── game.repository.ts
│   │   ├── services
│   │   │   └── game.service.ts
│   │   ├── store
│   │   │   └── game-store.ts
│   │   └── types
│   │   └── game.ts
│   ├── game-riddle
│   │   ├── api
│   │   │   └── game-riddle.ts
│   │   ├── components
│   │   │   ├── riddle-board-card.tsx
│   │   │   └── riddle-controller.tsx
│   │   ├── hooks
│   │   │   └── use-update-game-riddle.ts
│   │   ├── mapper
│   │   │   └── game-riddle.mapper.ts
│   │   ├── progress
│   │   ├── repository
│   │   │   ├── game-riddle.repository.ts
│   │   │   └── user-game-riddle.repository.ts
│   │   ├── services
│   │   │   └── game-riddle.service.ts
│   │   ├── types
│   │   │   ├── game-riddle.ts
│   │   │   └── user-game-riddle.ts
│   │   └── utilities
│   │   ├── game-type-helpers.ts
│   │   └── get-group-stats.ts
│   ├── home
│   │   └── components
│   │   └── dashboard-navbar.tsx
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
│   │   ├── api
│   │   │   └── openings.ts
│   │   ├── components
│   │   │   ├── opening-board-card.tsx
│   │   │   ├── opening-variant-controller.tsx
│   │   │   └── openings-list.tsx
│   │   ├── hooks
│   │   │   └── use-update-opening-variant.ts
│   │   ├── mapper
│   │   │   └── opening-variant.mapper.ts
│   │   ├── repository
│   │   │   ├── opening-variant.repository.ts
│   │   │   ├── opening.repository.ts
│   │   │   └── user-opening-variant.repository.ts
│   │   ├── services
│   │   │   └── openings.service.ts
│   │   ├── store
│   │   │   └── openings-store.ts
│   │   ├── types
│   │   │   ├── opening-variant.ts
│   │   │   ├── opening.ts
│   │   │   └── user-opening-variant.ts
│   │   ├── utils
│   │   └── validation
│   │   └── opening-variant-goals.ts
│   └── profile
│   ├── hooks
│   │   └── use-profile.ts
│   ├── repository
│   │   └── profile.repository.ts
│   └── types
│   └── profile.ts
├── hooks
│   ├── use-counter.ts
│   └── use-mobile.ts
├── lib
│   ├── chess
│   │   ├── getFenFromPgnAtPly.ts
│   │   ├── getFullMoveCountFromMoves.ts
│   │   ├── getPlyFromPgnAtFen.ts
│   │   ├── getUciMovesArrayFromPgn.ts
│   │   ├── getUciMovesFromPgnAfterPly.ts
│   │   ├── getUciMovesFromPgnAfterPlyAtMoveCount.ts
│   │   ├── hooks
│   │   │   └── use-chess.ts
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
│   │   │   ├── game-type-details.ts
│   │   │   └── opening-type-copy.ts
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
│   ├── utils
│   │   ├── cn.ts
│   │   ├── groupBy.ts
│   │   ├── shuffle.ts
│   │   └── slugify.ts
│   └── utils.ts
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
│   │   ├── cards
│   │   │   └── card_pawn_pyramid.png
│   │   ├── challanges
│   │   │   ├── 60_memorable_games_of_magnus_carlsen.png
│   │   │   ├── legend_games2.png
│   │   │   ├── magnus_morphy2.png
│   │   │   └── magnus_morphy_3.png
│   │   ├── features
│   │   │   ├── landing_page_features_game_1.png
│   │   │   ├── landing_page_features_game_2.png
│   │   │   └── landing_page_features_game_3.png
│   │   ├── goals
│   │   │   └── mic.svg
│   │   ├── hero
│   │   │   └── landing_page_1.png
│   │   └── pattern
│   │   └── bg-pattern01.svg
│   ├── next.svg
│   ├── stockfish.js
│   ├── vercel.svg
│   └── window.svg
├── skills-lock.json
├── tsconfig.json
└── tsconfig.tsbuildinfo
