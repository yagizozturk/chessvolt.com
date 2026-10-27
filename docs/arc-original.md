.
├── README.md
├── api-client
│   ├── client.ts
│   └── route-handler.ts
├── app
│   ├── (admin)
│   │   ├── admin
│   │   │   ├── animations
│   │   │   │   ├── components
│   │   │   │   │   ├── animation-preview.tsx
│   │   │   │   │   └── animations-list.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── blog
│   │   │   │   ├── actions
│   │   │   │   │   └── blog.ts
│   │   │   │   ├── components
│   │   │   │   │   ├── admin-blog-list.tsx
│   │   │   │   │   ├── blog-editor.tsx
│   │   │   │   │   └── blog-form.tsx
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── content-themes
│   │   │   │   ├── actions
│   │   │   │   │   └── content-themes.ts
│   │   │   │   ├── components
│   │   │   │   │   ├── content-theme-edit-form.tsx
│   │   │   │   │   ├── content-theme-form.tsx
│   │   │   │   │   └── content-themes-list.tsx
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── [kind]
│   │   │   │   │   └── [id]
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
│   │   │   ├── hooks
│   │   │   │   └── use-uci-rows-from-pgn.ts
│   │   │   ├── lib
│   │   │   │   └── puzzle-errors.ts
│   │   │   ├── openings
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── main-opening
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── actions
│   │   │   │   │   │   └── openings.ts
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── forms
│   │   │   │   │   │   │   ├── opening-edit-form.tsx
│   │   │   │   │   │   │   └── opening-form.tsx
│   │   │   │   │   │   └── list
│   │   │   │   │   │   └── main-openings-list.tsx
│   │   │   │   │   └── edit
│   │   │   │   │   └── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── variants
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actions
│   │   │   │   │   └── variants.ts
│   │   │   │   ├── bulk
│   │   │   │   │   ├── import-variants-form.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── components
│   │   │   │   │   ├── form
│   │   │   │   │   │   └── variant-pgn-goals-form.tsx
│   │   │   │   │   ├── list
│   │   │   │   │   │   └── opening-variants-list.tsx
│   │   │   │   │   └── variant-detail.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── pgn-goals-preview
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── pgn-goals-preview.tsx
│   │   │   │   └── pgn-visuals-comments-exporter
│   │   │   ├── page.tsx
│   │   │   ├── puzzles
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actions
│   │   │   │   │   ├── bulk-create-action.ts
│   │   │   │   │   ├── create-from-ply-action.ts
│   │   │   │   │   ├── delete-puzzle-action.ts
│   │   │   │   │   ├── import-lichess-action.ts
│   │   │   │   │   └── update-puzzle-action.ts
│   │   │   │   ├── components
│   │   │   │   │   ├── bulk-pgn-create-form.tsx
│   │   │   │   │   ├── delete-puzzle-button.tsx
│   │   │   │   │   ├── from-game-create-form.tsx
│   │   │   │   │   ├── lichess-import-form.tsx
│   │   │   │   │   ├── pgn-move-sequence-editor.tsx
│   │   │   │   │   ├── ply-pgn-create-form.tsx
│   │   │   │   │   ├── puzzle-edit-form.tsx
│   │   │   │   │   ├── puzzle-metadata-fields.tsx
│   │   │   │   │   └── puzzles-list.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── lib
│   │   │   │   │   ├── build-source-id-from-pgn.ts
│   │   │   │   │   ├── lichess
│   │   │   │   │   │   ├── apply-lichess-setup-move.test.ts
│   │   │   │   │   │   ├── apply-lichess-setup-move.ts
│   │   │   │   │   │   ├── ensure-theme.ts
│   │   │   │   │   │   ├── import-from-csv.ts
│   │   │   │   │   │   ├── lichess-slug.ts
│   │   │   │   │   │   ├── lichess-theme-map.json
│   │   │   │   │   │   ├── parse-csv.ts
│   │   │   │   │   │   ├── resolve-themes.ts
│   │   │   │   │   │   └── types.ts
│   │   │   │   │   ├── parse-puzzle-metadata.ts
│   │   │   │   │   ├── persist-puzzle.ts
│   │   │   │   │   ├── puzzle-form-state.ts
│   │   │   │   │   ├── resolve-puzzle-edit-pgn.ts
│   │   │   │   │   └── resolve-puzzle-sequence.ts
│   │   │   │   ├── new
│   │   │   │   │   ├── bulk
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── from-game
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── lichess
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── pgn-ply
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── shared
│   │   │   │   └── components
│   │   │   │   ├── admin-form-error-alert.tsx
│   │   │   │   ├── admin-pgn-board-picker.tsx
│   │   │   │   ├── admin-shell.tsx
│   │   │   │   └── sidebar
│   │   │   │   ├── admin-app-sidebar.tsx
│   │   │   │   ├── admin-nav-main.tsx
│   │   │   │   ├── admin-nav-user.tsx
│   │   │   │   └── admin-sidebar-brand.tsx
│   │   │   ├── studies
│   │   │   │   ├── actions
│   │   │   │   │   ├── studies.ts
│   │   │   │   │   └── study-content-themes.ts
│   │   │   │   ├── components
│   │   │   │   │   ├── studies-list.tsx
│   │   │   │   │   ├── study-content-theme-add-form.tsx
│   │   │   │   │   ├── study-content-themes-list.tsx
│   │   │   │   │   ├── study-content-themes-section.tsx
│   │   │   │   │   ├── study-difficulty-select.tsx
│   │   │   │   │   ├── study-edit-form.tsx
│   │   │   │   │   └── study-form.tsx
│   │   │   │   ├── constants
│   │   │   │   │   └── cover-images.ts
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── test
│   │   │   │   └── pgn-navigator
│   │   │   │   └── page.tsx
│   │   │   ├── themes
│   │   │   │   ├── actions
│   │   │   │   │   └── themes.ts
│   │   │   │   ├── components
│   │   │   │   │   ├── theme-edit-form.tsx
│   │   │   │   │   ├── theme-form.tsx
│   │   │   │   │   └── themes-list.tsx
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── [id]
│   │   │   │   │   └── page.tsx
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
│   │   ├── onboarding
│   │   │   └── page.tsx
│   │   ├── signup
│   │   │   └── page.tsx
│   │   └── update-password
│   │   └── page.tsx
│   ├── (dashboard)
│   │   ├── blog
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── game-analysis
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── openings
│   │   │   ├── [slug]
│   │   │   │   └── [id]
│   │   │   │   ├── [variantSlug]
│   │   │   │   │   └── [variantId]
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   └── variant
│   │   │   └── [slug]
│   │   │   └── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   ├── puzzles
│   │   │   ├── [id]
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── studies
│   │   │   ├── [slug]
│   │   │   │   ├── page.tsx
│   │   │   │   └── puzzle
│   │   │   │   └── [id]
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── volt-tracker
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── (marketing)
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── privacy
│   │   │   └── page.tsx
│   │   └── terms
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── global-error.tsx
│   ├── globals.css
│   ├── http
│   │   ├── chat
│   │   │   └── route.ts
│   │   ├── game-analysis
│   │   │   ├── analyze-game
│   │   │   │   ├── route.ts
│   │   │   │   └── stockfish
│   │   │   │   └── route.ts
│   │   │   ├── chesscom-games
│   │   │   │   └── route.ts
│   │   │   └── lichess-games
│   │   │   └── route.ts
│   │   ├── move-sequence
│   │   │   └── [sequenceId]
│   │   │   └── attempt
│   │   │   └── route.ts
│   │   ├── tts
│   │   │   └── route.ts
│   │   └── user-sequence-attempt
│   │   └── [attemptId]
│   │   └── event
│   │   └── route.ts
│   ├── journey
│   ├── journey-check
│   ├── layout.tsx
│   ├── page.tsx
│   └── sitemap.ts
├── assets
│   ├── chessground.css
│   ├── images
│   │   ├── board
│   │   │   ├── blue.svg
│   │   │   ├── dark-blue.png
│   │   │   ├── deep-blue.png
│   │   │   ├── green.png
│   │   │   ├── marble.jpg
│   │   │   ├── orange.png
│   │   │   ├── purple.png
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
│   ├── board-card-meta
│   │   └── board-card-meta-row.tsx
│   ├── board-navigator
│   │   └── volt-board-navigator.tsx
│   ├── board-status-icon
│   │   └── board-status-icon.tsx
│   ├── boards
│   │   ├── display-board
│   │   │   └── display-board.tsx
│   │   ├── volt-board
│   │   │   └── volt-board.tsx
│   │   └── volt-board-utilities
│   │   ├── board-history-controls.tsx
│   │   ├── use-board-history.ts
│   │   └── volt-board-utilities.tsx
│   ├── calculator
│   │   ├── accuracy-calculator
│   │   │   ├── accuracy-calculator.tsx
│   │   │   ├── compute-volt-accuracy.ts
│   │   │   └── volt-accuracy.config.ts
│   │   ├── rating-timing-calculator
│   │   │   ├── compute-rating-timing.ts
│   │   │   ├── rating-timing-calculator.tsx
│   │   │   └── rating-timing.config.ts
│   │   ├── streak-calculator
│   │   │   ├── compute-streak.ts
│   │   │   ├── streak-calculator.tsx
│   │   │   └── streak.config.ts
│   │   └── volt-calculator
│   │   ├── build-volt-score.ts
│   │   ├── build-volt-scores-by-sequence-id.ts
│   │   ├── compute-volt.ts
│   │   ├── get-grand-volt-score.ts
│   │   ├── get-sequence-move-count.ts
│   │   ├── get-sequence-volt-score.ts
│   │   ├── grand-volt.types.ts
│   │   ├── is-valid-volt-score.ts
│   │   ├── last-attempt-volt-points.tsx
│   │   ├── volt-calculator.tsx
│   │   ├── volt-score-chart.tsx
│   │   ├── volt.config.ts
│   │   └── volt.types.ts
│   ├── carousel-dialog
│   │   ├── carousel-dialog.tsx
│   │   └── carousel-dialog.types.ts
│   ├── custom-breadcrumb
│   │   └── custom-breadcrumb.tsx
│   ├── empty-data-message
│   │   └── empty-data-message.tsx
│   ├── empty-state
│   │   └── empty-state.tsx
│   ├── goal-viewer
│   │   ├── active-goal-card
│   │   │   └── active-goal-card.tsx
│   │   ├── goal-stepper
│   │   │   └── goal-stepper.tsx
│   │   ├── goal-viewer.tsx
│   │   └── types
│   │   └── types.ts
│   ├── label-badge
│   │   └── label-badge.tsx
│   ├── main-idea-card
│   │   └── main-idea-card.tsx
│   ├── notifier
│   │   └── notifier.tsx
│   ├── page-header
│   │   └── page-header.tsx
│   ├── page-loading
│   │   └── page-skeletons.tsx
│   ├── radial-chart
│   │   └── radial-chart.tsx
│   ├── sidebar
│   │   ├── app-sidebar.tsx
│   │   └── nav-main.tsx
│   ├── solve-success-dialog
│   │   └── solve-success-dialog.tsx
│   ├── stats
│   │   ├── column-based-stats.tsx
│   │   └── number-ticker-stats.tsx
│   ├── theme-provider
│   │   └── theme-provider.tsx
│   ├── three-col-card
│   │   └── three-col-card.tsx
│   ├── two-col-card
│   │   └── two-col-card.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── animated-list.tsx
│   │   ├── animated-shiny-text.tsx
│   │   ├── avatar.tsx
│   │   ├── backlight.tsx
│   │   ├── badge.tsx
│   │   ├── blur-fade.tsx
│   │   ├── board-sounds-toggle.tsx
│   │   ├── border-beam.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── combobox.tsx
│   │   ├── command.tsx
│   │   ├── confetti.tsx
│   │   ├── dia-text-reveal.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── field.tsx
│   │   ├── google-sign-in-button.tsx
│   │   ├── highlighter.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-group.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── number-ticker.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── progressive-blur.tsx
│   │   ├── rainbow-button.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── shine-border.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── sparkles-text.tsx
│   │   ├── spinner.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── text-animate.tsx
│   │   ├── text.tsx
│   │   ├── textarea.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── tooltip.tsx
│   │   └── typing-animation.tsx
│   ├── volt-button
│   │   └── volt-button.tsx
│   ├── volt-coach
│   │   └── volt-coach.tsx
│   ├── volt-explain-dialog
│   │   ├── use-volt-explain-dialog.ts
│   │   ├── volt-explain-dialog-auto-start.tsx
│   │   ├── volt-explain-dialog-store.ts
│   │   ├── volt-explain-dialog.config.tsx
│   │   └── volt-explain-dialog.tsx
│   └── volt-progress
│   └── volt-progress.tsx
├── components.json
├── docs
│   ├── accuracy-calculator.md
│   ├── colors.md
│   ├── comment-line-format.md
│   ├── content_themes_weight_logic.md
│   ├── css-class-structures.md
│   ├── element-classes.md
│   ├── onboarding-middleware-logic.md
│   ├── page-metadata.md
│   ├── product-map.md
│   ├── rating-time-calculator.md
│   ├── streak-calculator.md
│   ├── theme-tokens-lightness-rank.md
│   ├── themes_sort_order_logic.md
│   ├── volt-calculator.md
│   └── volt-overview.md
├── eslint.config.mjs
├── features
│   ├── auth
│   │   └── components
│   │   ├── forgot-password-form.tsx
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   ├── terms-and-conditions-dialog.tsx
│   │   └── update-password-form.tsx
│   ├── blog
│   │   ├── components
│   │   │   ├── blog-card.tsx
│   │   │   └── blog-list.tsx
│   │   ├── constants
│   │   │   ├── blog-editor-extensions.ts
│   │   │   └── blog.constants.ts
│   │   ├── mapper
│   │   │   └── blog-post.mapper.ts
│   │   ├── repository
│   │   │   └── blog.repository.ts
│   │   ├── services
│   │   │   └── blog.service.ts
│   │   ├── types
│   │   │   ├── blog-payload.ts
│   │   │   └── blog-post.ts
│   │   └── utilities
│   │   ├── blog-content.ts
│   │   ├── blog-cover.ts
│   │   ├── blog-html.ts
│   │   └── blog-slug.ts
│   ├── chat
│   │   ├── api
│   │   │   └── chat.ts
│   │   └── hooks
│   │   └── use-chat-stream.ts
│   ├── coach
│   │   └── components
│   │   └── coach-stockfish.tsx
│   ├── contact
│   │   ├── actions
│   │   │   └── submit-contact.ts
│   │   ├── components
│   │   │   └── contact-form.tsx
│   │   ├── mapper
│   │   │   └── contact-message.mapper.ts
│   │   ├── repository
│   │   │   └── contact-message.repository.ts
│   │   ├── services
│   │   │   └── contact-message.service.ts
│   │   └── types
│   │   └── contact-message.ts
│   ├── dashboard
│   │   ├── components
│   │   │   └── volt-how-to-carousel.tsx
│   │   └── constants
│   │   └── quick-links.ts
│   ├── favorites
│   │   ├── components
│   │   │   ├── favorites-search-filter.tsx
│   │   │   ├── favorites-sort-filter.tsx
│   │   │   └── favorites-view-filter.tsx
│   │   └── types
│   │   ├── favorites-sort.ts
│   │   └── favorites-view.ts
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
│   ├── game-analysis
│   │   ├── api
│   │   │   ├── analyze-game.ts
│   │   │   ├── chesscom-games.ts
│   │   │   └── lichess-games.ts
│   │   ├── components
│   │   │   ├── board-player-name.tsx
│   │   │   ├── chess-com-username-form.tsx
│   │   │   ├── game-analysis-controller.tsx
│   │   │   ├── game-analysis-mistake-stepper.tsx
│   │   │   ├── game-analysis-status.tsx
│   │   │   ├── lichess-username-form.tsx
│   │   │   ├── platform-form-card.tsx
│   │   │   ├── platform-games-provider.tsx
│   │   │   └── user-played-games-board.tsx
│   │   ├── constants
│   │   ├── hooks
│   │   │   └── use-platform-games.ts
│   │   ├── mapper
│   │   │   └── game-analysis.mapper.ts
│   │   ├── repository
│   │   │   └── game-analysis.repository.ts
│   │   ├── services
│   │   │   ├── analyze-game.service.ts
│   │   │   ├── get-favorited-mistake-ids.service.ts
│   │   │   ├── get-game-analysis-with-mistakes.service.ts
│   │   │   ├── save-game-analysis.service.ts
│   │   │   └── save-review-questions.service.ts
│   │   ├── types
│   │   │   ├── chess-games-archives-response.ts
│   │   │   ├── chess-games-by-month-response.ts
│   │   │   ├── chesscom-game-accuracies.ts
│   │   │   ├── chesscom-player-stats.ts
│   │   │   ├── chesscom-stats-category.ts
│   │   │   ├── create-game-analysis-data.ts
│   │   │   ├── critical-moment.ts
│   │   │   ├── game-analysis-response-data.ts
│   │   │   ├── game-analysis-source.ts
│   │   │   ├── game-analysis-with-mistakes.ts
│   │   │   ├── game-analysis.ts
│   │   │   ├── game-player.ts
│   │   │   ├── platform-game.ts
│   │   │   └── platform-games-context.ts
│   │   └── utilities
│   │   ├── analyze-pgn-with-stockfish.ts
│   │   ├── format-played-at.ts
│   │   ├── get-game-result.ts
│   │   ├── get-imported-game-display-info.ts
│   │   ├── get-mistakes-by-ply.ts
│   │   ├── get-player-usernames.ts
│   │   ├── get-rating-label.ts
│   │   ├── map-lichess-game.ts
│   │   └── parse-analysis.ts
│   ├── game-analysis-mistakes
│   │   ├── constants
│   │   │   └── game-analysis-mistake-description.constants.ts
│   │   ├── mapper
│   │   │   └── game-analysis-mistake.mapper.ts
│   │   ├── repository
│   │   │   └── game-analysis-mistake.repository.ts
│   │   ├── services
│   │   │   └── game-analysis-mistake.service.ts
│   │   └── types
│   │   └── game-analysis-mistake.ts
│   ├── journey
│   │   ├── components
│   │   ├── data
│   │   └── types
│   ├── landing
│   │   ├── components
│   │   │   ├── diamond-stats.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── features.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── landing-carousel.tsx
│   │   │   ├── landing-puzzle-controller.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── pricing.tsx
│   │   │   ├── puzzle-demo.tsx
│   │   │   ├── rocket.tsx
│   │   │   └── what-is-volt.tsx
│   │   └── constants
│   ├── legal
│   │   └── components
│   │   ├── legal-page.tsx
│   │   ├── privacy-content.tsx
│   │   └── terms-content.tsx
│   ├── move-sequence
│   │   ├── helpers
│   │   │   └── get-embedded-move-sequence.ts
│   │   ├── hooks
│   │   │   └── use-move-sequence-controller.ts
│   │   ├── mapper
│   │   │   └── move-sequence.mapper.ts
│   │   ├── repository
│   │   │   └── move-sequence.repository.ts
│   │   ├── services
│   │   │   └── move-sequence.service.ts
│   │   ├── types
│   │   │   ├── move-goal.ts
│   │   │   ├── move-sequence.ts
│   │   │   └── move-visual.ts
│   │   └── validation
│   │   └── move-sequence-goals.ts
│   ├── onboarding
│   │   ├── actions
│   │   │   └── complete-onboarding.ts
│   │   ├── components
│   │   │   ├── onboarding-form.tsx
│   │   │   └── onboarding-platform-username-step.tsx
│   │   ├── constants
│   │   │   └── onboarding-routes.ts
│   │   ├── services
│   │   │   └── complete-onboarding.service.ts
│   │   ├── types
│   │   │   ├── complete-onboarding-result.ts
│   │   │   └── onboarding-platform-usernames.ts
│   │   └── utilities
│   │   └── get-onboarding-routes.ts
│   ├── opening-variant-theme
│   │   ├── mapper
│   │   │   └── opening-variant-theme.mapper.ts
│   │   ├── repository
│   │   │   └── opening-variant-theme.repository.ts
│   │   └── types
│   │   └── opening-variant-theme.ts
│   ├── openings
│   │   ├── components
│   │   │   ├── main-idea-button.tsx
│   │   │   ├── opening-board-card.tsx
│   │   │   ├── opening-main-sidebar
│   │   │   │   └── opening-main-sidebar.tsx
│   │   │   ├── opening-type-filter.tsx
│   │   │   ├── opening-variant-controller.tsx
│   │   │   └── opening-variant-sidebar
│   │   │   └── opening-variant-sidebar.tsx
│   │   ├── constants
│   │   │   └── opening-variant-controller.constants.ts
│   │   ├── hooks
│   │   │   ├── use-move-evaluation.ts
│   │   │   └── use-opening-variant-tour.ts
│   │   ├── mapper
│   │   │   └── opening-variant.mapper.ts
│   │   ├── repository
│   │   │   ├── opening-variant.repository.ts
│   │   │   └── opening.repository.ts
│   │   ├── services
│   │   │   └── openings.service.ts
│   │   ├── store
│   │   │   └── openings-store.ts
│   │   ├── tours
│   │   │   └── opening-variant-tour-steps.ts
│   │   ├── types
│   │   │   ├── filter-types.ts
│   │   │   ├── opening-variant.ts
│   │   │   └── opening.ts
│   │   ├── utilities
│   │   │   ├── opening-cover-image.utils.ts
│   │   │   └── opening-variant-path.utils.ts
│   │   └── validation
│   │   └── opening-variant-goals.ts
│   ├── profile
│   │   ├── actions
│   │   │   ├── update-platform-usernames.ts
│   │   │   ├── update-profile-rating.ts
│   │   │   └── update-username.ts
│   │   ├── components
│   │   │   ├── profile-logout-button.tsx
│   │   │   ├── profile-platform-usernames-form.tsx
│   │   │   ├── profile-sounds-switch.tsx
│   │   │   ├── profile-theme-switch.tsx
│   │   │   ├── profile-username-form.tsx
│   │   │   └── user-avatar.tsx
│   │   ├── hooks
│   │   │   └── use-profile.ts
│   │   ├── repository
│   │   │   └── profile.repository.ts
│   │   ├── services
│   │   │   └── profile.service.ts
│   │   ├── types
│   │   │   ├── profile-onboarding-status.ts
│   │   │   ├── profile.ts
│   │   │   └── user-profile.ts
│   │   └── utilities
│   │   └── user-avatar.ts
│   ├── puzzle
│   │   ├── actions
│   │   ├── components
│   │   │   ├── puzzle-board-card.tsx
│   │   │   ├── puzzle-controller.tsx
│   │   │   └── puzzles-filters.tsx
│   │   ├── constants
│   │   │   ├── puzzle-accuracy.constants.ts
│   │   │   ├── puzzle-description.constants.ts
│   │   │   ├── puzzle-rating.constants.ts
│   │   │   ├── puzzles-list.constants.ts
│   │   │   └── random-puzzle.constants.ts
│   │   ├── hooks
│   │   │   └── use-puzzle-tour.ts
│   │   ├── loaders
│   │   │   ├── puzzle-page.loader.ts
│   │   │   └── study-puzzle-page-loader.ts
│   │   ├── mapper
│   │   │   └── puzzle.mapper.ts
│   │   ├── repository
│   │   │   └── puzzle.repository.ts
│   │   ├── services
│   │   │   ├── puzzle-list.service.ts
│   │   │   └── puzzle.service.ts
│   │   ├── tours
│   │   │   └── puzzle-tour-steps.ts
│   │   ├── types
│   │   │   ├── puzzle-loader-page-props.ts
│   │   │   ├── puzzle-rating.ts
│   │   │   ├── puzzle-with-themes.ts
│   │   │   ├── puzzle.ts
│   │   │   └── random-active-puzzle.ts
│   │   └── utilities
│   │   ├── build-puzzle-url.ts
│   │   ├── game-type-helpers.ts
│   │   ├── get-next-puzzle-url.ts
│   │   ├── get-parent-study-url.ts
│   │   ├── normalize-uuid.ts
│   │   ├── parse-puzzle-popularity.ts
│   │   └── puzzle-filter.utils.ts
│   ├── puzzle-theme
│   │   ├── mapper
│   │   │   └── puzzle-theme.mapper.ts
│   │   ├── repository
│   │   │   └── puzzle-theme.repository.ts
│   │   ├── services
│   │   │   └── puzzle-theme.service.ts
│   │   └── types
│   │   └── puzzle-theme.ts
│   ├── study
│   │   ├── components
│   │   │   ├── study-card.tsx
│   │   │   ├── study-filters.tsx
│   │   │   ├── study-header.tsx
│   │   │   ├── study-pagination.tsx
│   │   │   └── study-puzzles-pagination.tsx
│   │   ├── constants
│   │   │   ├── study-difficulty.constants.ts
│   │   │   ├── study-pagination.constants.ts
│   │   │   └── study-puzzles-pagination.constants.ts
│   │   ├── loaders
│   │   │   └── study-puzzles-page.loader.ts
│   │   ├── mapper
│   │   │   └── study.mapper.ts
│   │   ├── repository
│   │   │   └── study.repository.ts
│   │   ├── services
│   │   │   └── study.service.ts
│   │   ├── types
│   │   │   ├── study-difficulty.ts
│   │   │   ├── study-filter.ts
│   │   │   ├── study-payload.ts
│   │   │   ├── study-puzzles.ts
│   │   │   ├── study-search-params.ts
│   │   │   └── study.ts
│   │   └── utilities
│   │   ├── study-cover-image.utils.ts
│   │   ├── study-difficulty.utils.ts
│   │   ├── study-filter.utils.ts
│   │   ├── study-pagination.utils.ts
│   │   ├── study-puzzle-count-format.utils.ts
│   │   └── study-puzzles-pagination.utils.ts
│   ├── study-puzzles
│   │   ├── mapper
│   │   │   └── study-puzzle.mapper.ts
│   │   ├── repository
│   │   │   └── study-puzzle.repository.ts
│   │   ├── services
│   │   │   └── study-puzzles.service.ts
│   │   ├── types
│   │   │   └── study-puzzle.ts
│   │   └── utilities
│   ├── study-theme
│   │   ├── mapper
│   │   │   └── study-theme.mapper.ts
│   │   ├── repository
│   │   │   └── study-theme.repository.ts
│   │   ├── services
│   │   │   └── study-theme.service.ts
│   │   └── types
│   │   └── study-theme.ts
│   ├── theme
│   │   ├── components
│   │   │   ├── theme-badge.tsx
│   │   │   ├── theme-category-select.tsx
│   │   │   └── theme-select.tsx
│   │   ├── mapper
│   │   │   └── theme.mapper.ts
│   │   ├── repository
│   │   │   └── theme.repository.ts
│   │   ├── services
│   │   │   └── theme.service.ts
│   │   ├── types
│   │   │   ├── theme-category.ts
│   │   │   └── theme.ts
│   │   └── utilities
│   │   ├── group-themes-by-category.ts
│   │   └── theme-cover-image.utils.ts
│   ├── theme-link
│   │   ├── components
│   │   │   ├── theme-link-kind-select.tsx
│   │   │   └── theme-link-weight-select.tsx
│   │   ├── services
│   │   │   └── theme-link-admin.service.ts
│   │   └── types
│   │   ├── admin-theme-link.ts
│   │   ├── theme-link-kind.ts
│   │   └── theme-link-weight.ts
│   ├── tts
│   │   ├── api
│   │   │   └── tts.ts
│   │   ├── components
│   │   │   └── tts-controller
│   │   │   └── tts-controller.tsx
│   │   └── utilities
│   │   ├── resolve-tts-audio.ts
│   │   ├── tts-cache.ts
│   │   ├── tts-config.ts
│   │   └── tts-storage.ts
│   ├── user-favorites
│   │   ├── actions
│   │   │   └── toggle-favorite.ts
│   │   ├── components
│   │   │   ├── favorite-button.tsx
│   │   │   ├── user-favorite-game-analysis-mistakes.tsx
│   │   │   ├── user-favorite-opening-variants.tsx
│   │   │   └── user-favorite-puzzles.tsx
│   │   ├── mapper
│   │   │   └── user-favorite.mapper.ts
│   │   ├── repository
│   │   │   └── user-favorite.repository.ts
│   │   ├── services
│   │   │   ├── toggle-favorite.ts
│   │   │   └── user-favorite.service.ts
│   │   └── types
│   │   └── user-favorite.ts
│   ├── user-sequence-attempt
│   │   ├── api
│   │   │   └── sequence-attempt.ts
│   │   ├── hooks
│   │   │   └── use-sequence-attempt.ts
│   │   ├── mapper
│   │   │   └── user-sequence-attempt.mapper.ts
│   │   ├── repository
│   │   │   └── user-sequence-attempt.repository.ts
│   │   ├── services
│   │   │   └── user-sequence-attempt.service.ts
│   │   ├── types
│   │   │   ├── puzzle-attempt-status.ts
│   │   │   ├── sequence-complete-dialog-stats.ts
│   │   │   └── user-sequence-attempt.ts
│   │   └── utilities
│   │   ├── attempt-status.ts
│   │   ├── compute-sequence-attempt-accuracy.ts
│   │   ├── create-attempt-payload.ts
│   │   ├── create-attempt-stats-by-sequence-id-map.ts
│   │   ├── format-attempt-duration.ts
│   │   ├── get-latest-attempt-stats.ts
│   │   ├── get-sequence-attempt-stats.ts
│   │   └── update-correct-streak.ts
│   └── user-sequence-attempt-event
│   ├── mapper
│   │   └── user-sequence-attempt-event.mapper.ts
│   ├── repository
│   │   └── user-sequence-attempt-event.repository.ts
│   ├── services
│   │   └── user-sequence-attempt-event.service.ts
│   └── types
│   ├── sequence-attempt-event-type.ts
│   └── user-sequence-attempt-event.ts
├── hooks
│   ├── use-counter.ts
│   └── use-mobile.ts
├── instrumentation-client.ts
├── instrumentation.ts
├── lib
│   ├── chess
│   │   ├── buildUci.ts
│   │   ├── getFenFromPgnAtPly.ts
│   │   ├── getFenFromUciMovesAtPly.ts
│   │   ├── getFullMoveCountFromMoves.ts
│   │   ├── getLastPositionFenFromPgn.ts
│   │   ├── getMovesFromPgn.ts
│   │   ├── getOrientationFromFen.ts
│   │   ├── getPlayerColorFromPgn.ts
│   │   ├── getPlyFromPgnAtFen.ts
│   │   ├── getPromotionPiece.ts
│   │   ├── getTurnLabel.ts
│   │   ├── getUciMovesArrayFromPgn.ts
│   │   ├── getUciMovesFromPgnAfterPly.ts
│   │   ├── getUciMovesFromPgnAfterPlyAtMoveCount.ts
│   │   ├── hooks
│   │   │   └── use-chess.ts
│   │   ├── parse-pgn-visual-comments.ts
│   │   ├── parsePgn.ts
│   │   ├── parseUci.ts
│   │   └── toDests.ts
│   ├── chess-api
│   │   ├── client.ts
│   │   ├── errors.ts
│   │   ├── normalize.ts
│   │   └── types.ts
│   ├── chess-com
│   │   ├── client.ts
│   │   ├── constants.ts
│   │   ├── errors.ts
│   │   ├── get-player-stats.ts
│   │   └── get-recent-games.ts
│   ├── chess-platform
│   │   ├── pick-rating.ts
│   │   ├── resolve-player-rating.ts
│   │   └── types.ts
│   ├── chessground
│   │   └── hooks
│   │   └── use-chessgroud.ts
│   ├── engine
│   │   ├── create-engine.ts
│   │   ├── hooks
│   │   │   └── use-stockfish-engine.ts
│   │   └── parse-engine.ts
│   ├── lichess
│   │   ├── client.ts
│   │   ├── errors.ts
│   │   ├── get-recent-games.ts
│   │   ├── get-user.ts
│   │   └── types.ts
│   ├── logger
│   │   └── logger.ts
│   ├── metadata
│   │   └── training-page-metadata.ts
│   ├── move-sequence-goals
│   │   ├── build-stub-goals.ts
│   │   ├── build-user-payload.ts
│   │   ├── expected-goals.ts
│   │   ├── merge-goals-overlay.ts
│   │   ├── parse-goals.ts
│   │   └── types.ts
│   ├── open-ai
│   │   ├── ai.config.ts
│   │   ├── concate-prompt.ts
│   │   └── open-ai.ts
│   ├── shared
│   │   ├── constants
│   │   │   ├── chess.ts
│   │   │   ├── game-type-details.ts
│   │   │   └── opening-type-copy.ts
│   │   ├── hooks
│   │   │   ├── sound
│   │   │   │   ├── use-board-sounds.ts
│   │   │   │   └── use-sound.ts
│   │   │   ├── tour
│   │   │   │   ├── product-tour-config.ts
│   │   │   │   └── use-product-tour.ts
│   │   │   └── use-mobile.ts
│   │   ├── store
│   │   │   ├── board-sounds-store.ts
│   │   │   ├── coach-store.ts
│   │   │   └── volt-coach-sound-store.ts
│   │   ├── tour
│   │   │   └── data-tour.ts
│   │   └── types
│   │   ├── engine-info.ts
│   │   ├── game-difficulty.ts
│   │   ├── game-status.ts
│   │   ├── move-attempt-payload.ts
│   │   ├── move-evaluation-payload.ts
│   │   └── move.ts
│   ├── supabase
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   ├── postgrest-user-message.ts
│   │   └── server.ts
│   ├── utils
│   │   ├── cn.ts
│   │   ├── getMoveFeedbackClass.ts
│   │   ├── getMoveQuality.ts
│   │   ├── groupBy.ts
│   │   ├── slugify.ts
│   │   └── validation.ts
│   └── utils.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── audio
│   │   ├── magic.mp3
│   │   ├── sound-level-up.mp3
│   │   ├── voltboard-correct-move.mp3
│   │   └── voltboard-false-move.mp3
│   ├── file.svg
│   ├── globe.svg
│   ├── images
│   │   ├── animations
│   │   │   ├── animation-badge.json
│   │   │   ├── animation-book.json
│   │   │   ├── animation-caution.json
│   │   │   ├── animation-coin.json
│   │   │   ├── animation-complete.json
│   │   │   ├── animation-contact.json
│   │   │   ├── animation-fail-150px-120px.gif
│   │   │   ├── animation-favorite.json
│   │   │   ├── animation-info-question.json
│   │   │   ├── animation-loader.json
│   │   │   ├── animation-loading.json
│   │   │   ├── animation-rocjet-launch.json
│   │   │   ├── animation-solved.json
│   │   │   ├── animation-success-150px.gif
│   │   │   ├── animation-target-blue.json
│   │   │   ├── animation-trophy.json
│   │   │   ├── animation-warning-yellow.json
│   │   │   ├── lightning.json
│   │   │   └── volt-score.json
│   │   ├── avatar
│   │   │   ├── main-idea-avatar-2.png
│   │   │   ├── main-idea-avatar.png
│   │   │   └── volt-robot.png
│   │   ├── cards
│   │   │   ├── bg-arrows-game.png
│   │   │   ├── bg-earn-volt.png
│   │   │   ├── bg-masters-game.png
│   │   │   ├── bg-opening-crusher-game-alternative.png
│   │   │   └── bg-opening-crusher-game.png
│   │   ├── error
│   │   │   └── volt-global-error.png
│   │   ├── favicon
│   │   │   └── favicon.svg
│   │   ├── form
│   │   │   ├── chess-com-logo.png
│   │   │   ├── chess-com-pawn-logo.png
│   │   │   ├── create-account-form-header.png
│   │   │   ├── lichess-logo.png
│   │   │   ├── log-in-account-form-header.png
│   │   │   ├── log-in-form-header.png
│   │   │   ├── login-form-header-2.png
│   │   │   ├── login-form-header.png
│   │   │   ├── profile-form-header.png
│   │   │   ├── sign-up-form-header.png
│   │   │   └── signup-form-header.png
│   │   ├── hero
│   │   │   ├── bg-boost-chess-rocket.png
│   │   │   ├── bg-volt-piece-hold.png
│   │   │   ├── bg-volt-playing-chess.png
│   │   │   ├── curve-4.png
│   │   │   └── hero-account-logo.png
│   │   ├── icons
│   │   │   ├── icon-bell.png
│   │   │   ├── icon-blog.png
│   │   │   ├── icon-blunder-2.png
│   │   │   ├── icon-blunder-double.png
│   │   │   ├── icon-book-study.png
│   │   │   ├── icon-book.png
│   │   │   ├── icon-chart-tracker.png
│   │   │   ├── icon-checkmark.png
│   │   │   ├── icon-circle-volt.png
│   │   │   ├── icon-contact.png
│   │   │   ├── icon-dead.png
│   │   │   ├── icon-error.png
│   │   │   ├── icon-favorite.png
│   │   │   ├── icon-fundamentals.png
│   │   │   ├── icon-game-review.png
│   │   │   ├── icon-goal.png
│   │   │   ├── icon-group.png
│   │   │   ├── icon-king.png
│   │   │   ├── icon-knight-upt.png
│   │   │   ├── icon-library-tr.png
│   │   │   ├── icon-link.png
│   │   │   ├── icon-mistake.png
│   │   │   ├── icon-more.png
│   │   │   ├── icon-openings.png
│   │   │   ├── icon-pawn.png
│   │   │   ├── icon-puzzle.png
│   │   │   ├── icon-settings.png
│   │   │   ├── icon-sword.png
│   │   │   ├── icon-tracker-3.png
│   │   │   ├── icon-traps.png
│   │   │   ├── icon-user-profile.png
│   │   │   ├── icon-volt.png
│   │   │   └── icon-warning.png
│   │   ├── openings
│   │   │   ├── bg-caro-kann.png
│   │   │   ├── bg-london-opening-5.png
│   │   │   ├── bg-london-system-2.png
│   │   │   ├── bg-london-system.png
│   │   │   ├── bg-opening-default.png
│   │   │   ├── bg-openings.png
│   │   │   ├── bg-scandinavian.png
│   │   │   └── bg-semi-slav.png
│   │   ├── pattern
│   │   │   └── bg-pattern.svg
│   │   ├── studies
│   │   │   ├── 60-games-of-carlsen.png
│   │   │   ├── best-move-contest-find-mate.png
│   │   │   ├── bg-london-system.png
│   │   │   ├── bg-semi-slav.png
│   │   │   ├── chess-miniatures.png
│   │   │   ├── classic-games-major-lessons-3.png
│   │   │   ├── from-tal-to-kasparov.png
│   │   │   ├── study-default-cover-image.png
│   │   │   └── study-default-image.png
│   │   ├── themes
│   │   │   ├── back_rank_mate.png
│   │   │   ├── bishop_endgame.png
│   │   │   ├── capturing_defender.png
│   │   │   ├── default.png
│   │   │   ├── discovered_attack.png
│   │   │   ├── double_bishop_mate.png
│   │   │   ├── double_check.png
│   │   │   ├── fork.png
│   │   │   ├── hanging_piece.png
│   │   │   ├── knight_endgame.png
│   │   │   ├── morphy_mate.png
│   │   │   ├── pawn_endgame.png
│   │   │   ├── pin.png
│   │   │   ├── queen_endgame.png
│   │   │   ├── skewer.png
│   │   │   └── trapped_piece.png
│   │   └── volt-explain
│   │   ├── how_to_step_1.png
│   │   ├── how_to_step_2.png
│   │   ├── how_to_step_3.png
│   │   ├── how_to_step_4.png
│   │   ├── slide-1.png
│   │   ├── slide-2-3.png
│   │   └── slide-3a.png
│   ├── llms.txt
│   ├── next.svg
│   ├── robots.txt
│   ├── stockfish.js
│   ├── vercel.svg
│   └── window.svg
├── sentry.edge.config.ts
├── sentry.server.config.ts
├── skills-lock.json
├── supabase
│   └── migrations
│   ├── 20260910120000_game_review_questions.sql
│   ├── 20260913125007_add_game_review_question_to_user_favorites.sql
│   ├── 20260928164000_drop_game_review_question_move_sequence_id.sql
│   └── 20261003150000_create_blog_posts.sql
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── types
└── css.d.ts
