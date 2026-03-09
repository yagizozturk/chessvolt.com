├── README.md
├── app
│   ├── (auth)
│   │   ├── auth
│   │   ├── forgot-password
│   │   ├── layout.tsx
│   │   ├── login
│   │   └── signup
│   ├── (dashboard)
│   │   ├── dashboard
│   │   ├── game-riddle
│   │   ├── challenge
│   │   ├── layout.tsx
│   │   ├── play
│   │   └── puzzle
│   ├── (marketing)
│   │   ├── challenge-preview
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── http
│   │   ├── chat
│   │   ├── game-riddle
│   │   └── puzzle
│   └── layout.tsx ✅
├── assets
│   ├── chessground.css
│   ├── images
│   │   ├── board
│   │   └── pieces
│   ├── piyon.css
│   └── theme
│   └── theme.css
├── components
│   ├── app-sidebar.tsx
│   ├── auth
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── controller
│   │   ├── game-controller.tsx
│   │   ├── puzzle-controller.tsx
│   │   ├── reps-controller.tsx
│   │   └── riddle-controller.tsx
│   ├── game
│   │   ├── navbar.tsx
│   │   ├── stat-item.tsx
│   │   └── user-stats.tsx
│   ├── landing
│   │   ├── features.tsx
│   │   ├── footer.tsx
│   │   ├── game-modes.tsx
│   │   ├── gamification-features.tsx
│   │   ├── hero.tsx
│   │   ├── challenge-preview.tsx
│   │   ├── navbar.tsx (mobildeki buttonlar kaldı ❌)
│   │   └── pricing.tsx
│   ├── play-board
│   │   ├── inactive-play-board.tsx
│   │   └── play-board.tsx
│   ├── puzzle-board
│   │   └── puzzle-board.tsx
│   ├── riddle-board
│   │   └── riddle-board.tsx
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
│   └── tabs.tsx
├── components.json
├── docs
│   └── archtecture.md
├── eslint.config.mjs
├── hooks
│   ├── use-chat-stream.ts
│   ├── use-chess.ts
│   ├── use-chessgroud.ts
│   ├── use-counter.ts
│   ├── use-get-puzzle-coach.ts
│   ├── use-mobile.ts
│   ├── use-sound.ts
│   ├── use-stockfish-engine.ts
│   ├── use-update-game-riddle.ts
│   └── use-update-puzzle.ts
├── lib
│   ├── api
│   │   ├── chat.ts
│   │   ├── client.ts
│   │   ├── game-riddle.ts
│   │   ├── puzzle.ts
│   │   └── route-handler.ts
│   ├── chess-board
│   │   ├── createMoveFromUci.ts
│   │   ├── createMoveObjectsFromMultiPvs.ts
│   │   ├── getFenFromPgnAtPly.ts
│   │   ├── getTurn.ts
│   │   └── toDests.ts
│   ├── mappers
│   │   ├── game-riddle.ts
│   │   ├── game.ts
│   │   └── puzzle.ts
│   ├── model
│   │   ├── engine-info.ts
│   │   ├── game-riddle.ts
│   │   ├── game-status.ts
│   │   ├── game.ts
│   │   ├── move.ts
│   │   ├── puzzle.ts
│   │   ├── reps.ts
│   │   └── user-game-riddle.ts
│   ├── open-ai.ts
│   ├── prompt
│   │   ├── ai.config.ts
│   │   └── concate-prompt.ts
│   ├── repositories
│   │   ├── game-riddle.repository.ts
│   │   ├── game.repository.ts
│   │   ├── puzzle.repository.ts
│   │   ├── reps.repository.ts
│   │   ├── user-game-riddle.repository.ts
│   │   └── user-puzzle.repository.ts
│   ├── services
│   │   ├── game-riddle.ts
│   │   ├── game.ts
│   │   ├── puzzle.ts
│   │   └── reps.ts
│   ├── stockfish
│   │   ├── createEngine.ts
│   │   └── parseEngine.ts
│   ├── supabase
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── images
│   │   └── hero
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── stores
│   ├── coach-store.ts
│   ├── game-store.ts
│   ├── stats-store.ts
│   ├── reps-store.ts
│   └── test-store.ts
├── supabase
│   └── migrations
├── tsconfig.json
└── types
└── game.ts
