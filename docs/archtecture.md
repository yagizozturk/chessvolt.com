├── README.md
├── api-client
│   ├── client.ts
│   └── route-handler.ts
├── app
│   ├── (admin)
│   │   ├── admin
│   │   └── layout.tsx
│   ├── (auth)
│   │   ├── auth
│   │   ├── forgot-password
│   │   ├── layout.tsx
│   │   ├── login
│   │   └── signup
│   ├── (dashboard)
│   │   ├── challenge
│   │   ├── game-riddle
│   │   ├── layout.tsx
│   │   ├── openings
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
│   │   ├── profile
│   │   └── puzzle
│   ├── layout.tsx
│   └── storybook
│   └── page.tsx
├── assets
│   ├── chessground.css
│   ├── images
│   │   ├── board
│   │   └── pieces
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
│   └── hardcoded-colors-audit.md
├── eslint.config.mjs
├── features
│   ├── admin
│   │   └── components
│   ├── auth
│   │   └── components
│   ├── chat
│   │   ├── api
│   │   ├── hooks
│   │   └── types
│   ├── coach
│   │   └── components
│   ├── game
│   │   ├── mapper
│   │   ├── repository
│   │   ├── services
│   │   ├── store
│   │   └── types
│   ├── game-riddle
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── mapper
│   │   ├── repository
│   │   ├── services
│   │   └── types
│   ├── home
│   │   ├── components
│   │   └── store
│   ├── landing
│   │   └── components
│   ├── openings
│   │   ├── components
│   │   ├── mapper
│   │   ├── repository
│   │   ├── services
│   │   ├── store
│   │   └── types
│   ├── playground
│   │   └── components
│   ├── profile
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── repository
│   │   ├── services
│   │   ├── store
│   │   └── types
│   └── puzzle
│   ├── api
│   ├── components
│   ├── hooks
│   ├── mapper
│   ├── repository
│   ├── services
│   ├── store
│   └── types
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
│   │   ├── movesToPgn.ts
│   │   ├── parsePgn.ts
│   │   └── toDests.ts
│   ├── chessground
│   │   └── hooks
│   ├── engine
│   │   ├── createEngine.ts
│   │   ├── hooks
│   │   └── parseEngine.ts
│   ├── open-ai
│   │   ├── ai.config.ts
│   │   ├── concate-prompt.ts
│   │   └── open-ai.ts
│   ├── shared
│   │   ├── constants
│   │   ├── hooks
│   │   ├── store
│   │   └── types
│   ├── supabase
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── utilities
│   ├── cn.ts
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
│   │   ├── features
│   │   └── hero
│   ├── next.svg
│   ├── stockfish.js
│   ├── vercel.svg
│   └── window.svg
├── supabase
│   └── migrations
│   └── 20250313000000_add_slug_to_openings.sql
└── tsconfig.json

117 directories, 78 files
