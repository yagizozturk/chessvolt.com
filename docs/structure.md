// TODO: Refactor
# ChessVolt Root

## api-client

- client.ts
- route-handler.ts

## app

### (auth)

#### auth

##### callback

- route.ts

#### forgot-password

- page.tsx

#### layout.tsx

#### login

- page.tsx

#### onboarding

- page.tsx

#### signup

- page.tsx

#### update-password

- page.tsx

### (dashboard)

#### collection

##### [slug]

- page.tsx

##### riddle

###### [id]

- page.tsx

##### loading.tsx

##### page.tsx

#### dashboard

- page.tsx

#### layout.tsx

#### openings

##### [slug]

###### [id]

- page.tsx

#### arrows

##### [id]

- page.tsx

#### loading.tsx

#### page.tsx

#### variant

##### [id]

- page.tsx

#### profile

- page.tsx

#### riddles

##### [id]

- page.tsx

##### page.tsx

#### user-collection

##### [slug]

###### page.tsx

###### riddle

####### [id]

- page.tsx

##### actions

- create-my-collection.ts
- delete-my-collection.ts
- index.ts
- shared.ts
- update-my-collection.ts

##### loading.tsx

##### page.tsx

#### user-opening-variants

##### loading.tsx

##### page.tsx

### contact

- page.tsx

### favicon.ico

### globals.css

### http

#### chat

- route.ts

#### move-sequence

##### [sequenceId]

###### attempt

- route.ts

#### tts

- route.ts

#### user-sequence-attempt

##### [attemptId]

###### event

- route.ts

### layout.tsx

### page.tsx

## components

### badge

#### icon-tooltip-badge

- icon-tooltip-badge.tsx

#### image-tooltip-badge

- image-tooltip-badge.tsx

#### number-badge

- number-badge.tsx

### board-card-meta

- board-card-meta-row.tsx

### board-navigator

- volt-board-navigator.tsx

### board-status-icon

- board-status-icon.tsx

### boards

#### arrow-board

- arrow-board.tsx

#### display-board

- display-board.tsx

#### volt-board

- volt-board.tsx

### calculator

#### README.md

#### accuracy-calculator

- README.md
- accuracy-calculator.tsx
- compute-volt-accuracy.ts
- volt-accuracy.config.ts

#### rating-timing-calculator

- README.md
- compute-rating-timing.ts
- rating-timing-calculator.tsx
- rating-timing.config.ts

#### streak-calculator

- README.md
- compute-streak.ts
- streak-calculator.tsx
- streak.config.ts

#### volt-calculator

- README.md
- build-volt-score.ts
- build-volt-scores-by-sequence-id.ts
- compute-volt.ts
- get-grand-volt-score.ts
- get-sequence-move-count.ts
- get-sequence-volt-score.ts
- grand-volt.types.ts
- is-valid-volt-score.ts
- volt-calculator.tsx
- volt.config.ts
- volt.types.ts

### carousel-dialog

- carousel-dialog.tsx
- carousel-dialog.types.ts

### chessvolt-logo.tsx

### empty-data-message

- empty-data-message.tsx

### game

- navbar.tsx

### goal-viewer

#### active-goal-card

- active-goal-card.tsx

#### goal-stepper

- goal-stepper.tsx

#### goal-viewer.tsx

#### inactive-next-goal-row

- inactive-next-goal-row.tsx

#### types

- types.ts

### notifier

- notifier.tsx

### radial-chart

- radial-chart.tsx

### sidebar

- app-sidebar.tsx
- nav-main.tsx
- nav-settings.tsx

### solve-success-dialog

- solve-success-dialog.tsx

### stats

#### column-based-stats.tsx

#### number-ticker-stats.tsx

### theme-provider

- theme-provider.tsx

### ui

- alert-dialog.tsx
- alert.tsx
- animated-list.tsx
- avatar.tsx
- backlight.tsx
- badge.tsx
- blur-fade.tsx
- board-sounds-toggle.tsx
- border-beam.tsx
- breadcrumb.tsx
- button.tsx
- card.tsx
- carousel.tsx
- chart.tsx
- checkbox.tsx
- collapsible.tsx
- combobox.tsx
- command.tsx
- confetti.tsx
- dia-text-reveal.tsx
- dialog.tsx
- dropdown-menu.tsx
- field.tsx
- highlighter.tsx
- hover-card.tsx
- input-group.tsx
- input.tsx
- label.tsx
- navigation-menu.tsx
- number-ticker.tsx
- popover.tsx
- progress.tsx
- progressive-blur.tsx
- rainbow-button.tsx
- scroll-area.tsx
- select.tsx
- separator.tsx
- sheet.tsx
- shine-border.tsx
- sidebar.tsx
- skeleton.tsx
- sonner.tsx
- sparkles-text.tsx
- spinner.tsx
- switch.tsx
- tabs.tsx
- text-animate.tsx
- text.tsx
- textarea.tsx
- theme-toggle.tsx
- tooltip.tsx
- typing-animation.tsx

### volt-coach

- volt-coach.tsx

### volt-explain-dialog

- use-volt-explain-dialog.ts
- volt-explain-dialog-auto-start.tsx
- volt-explain-dialog-store.ts
- volt-explain-dialog.config.tsx
- volt-explain-dialog.tsx

## components.json

## features

### arrows

#### components

##### arrows-board-card

- arrows-board-card.tsx

##### arrows-controller

- arrows-controller.tsx

##### arrows-goal-card

- arrows-goal-card.tsx

#### hooks

- use-arrows-controller.ts
- use-arrows-tour.ts

#### tours

- arrows-tour-steps.ts

#### types

### auth

#### components

- forgot-password-form.tsx
- login-form.tsx
- signup-form.tsx
- terms-and-conditions-dialog.tsx
- update-password-form.tsx

### chat

#### api

- chat.ts

#### hooks

- use-chat-stream.ts

### coach

#### components

- coach-stockfish.tsx

### collection

#### components

- collection-card.tsx
- collection-filters.tsx
- collection-header.tsx
- collection-list-with-filters.tsx

#### hooks

- use-collection-filters.ts

#### mapper

- collection.mapper.ts

#### repository

- collection.repository.ts

#### services

- collection.service.ts

#### types

- collection-difficulty.ts
- collection-payload.ts
- collection-type.ts
- collection.ts

#### utilities

- collection-cover-image.utils.ts
- collection-filter.utils.ts
- collection-riddle-count-format.utils.ts

### collection-riddles

#### mapper

- collection-riddle.mapper.ts

#### repository

- collection-riddle.repository.ts

#### services

- add-riddle-to-user-custom-collection.ts
- collection-riddles.service.ts

#### types

- collection-riddle.ts

#### utilities

### collection-theme

#### mapper

- collection-theme.mapper.ts

#### repository

- collection-theme.repository.ts

#### services

- collection-theme.service.ts

#### types

- collection-theme.ts

### contact

#### actions

- submit-contact.ts

#### components

- contact-form.tsx

#### mapper

- contact-message.mapper.ts

#### repository

- contact-message.repository.ts

#### services

- contact-message.service.ts

#### types

- contact-message.ts

### dashboard

#### components

- dashboard-page.tsx

### game

#### mapper

- game.mapper.ts

#### repository

- game.repository.ts

#### services

- game.service.ts

#### store

- game-store.ts

#### types

- game.ts

### home

#### components

##### dashboard

### landing

#### components

- curve.tsx
- features.tsx
- featute-item.tsx
- footer.tsx
- hero.tsx
- information.tsx
- navbar.tsx
- pricing.tsx

### move-sequence

#### helpers

- get-embedded-move-sequence.ts

#### hooks

- use-move-sequence-controller.ts

#### mapper

- move-sequence.mapper.ts

#### repository

- move-sequence.repository.ts

#### services

- backfill-goals.service.ts
- move-sequence.service.ts

#### types

- move-goal.ts
- move-sequence-for-goals-backfill.ts
- move-sequence.ts

#### validation

- move-sequence-goals.ts

### onboarding

#### actions

- complete-onboarding.ts

#### components

- onboarding-form.tsx
- onboarding-platform-username-step.tsx

#### constants

- onboarding-questions.ts
- onboarding-routes.ts

#### services

- complete-onboarding.service.ts

#### types

- complete-onboarding-result.ts
- onboarding-completion-data.ts
- onboarding-platform-usernames.ts
- onboarding-question-answers.ts
- onboarding-step-data.ts
- validate-chess-familiarity-answer-result.ts
- validate-onboarding-answers-structure-result.ts
- validate-onboarding-answers-with-options-result.ts
- validate-onboarding-submission-result.ts

#### utilities

- get-onboarding-routes.ts
- resolve-onboarding-completion-data.ts
- validate-chess-familiarity-answer.ts
- validate-onboarding-answers.ts
- validate-onboarding-submission.ts

### onboarding-option

#### components

- onboarding-option-card.tsx
- onboarding-option-list.tsx

#### mapper

- onboarding-option.mapper.ts

#### repository

- onboarding-option.repository.ts

#### services

- onboarding-option.service.ts

#### types

- onboarding-option-with-question.ts
- onboarding-option.ts
- onboarding-rating.ts

### onboarding-question

#### components

- onboarding-question-list.tsx
- onboarding-question.tsx

#### mapper

- onboarding-question.mapper.ts

#### repository

- onboarding-question.repository.ts

#### services

- onboarding-question.service.ts

#### types

- onboarding-question.ts

### opening-variant-theme

#### mapper

- opening-variant-theme.mapper.ts

#### repository

- opening-variant-theme.repository.ts

#### types

- opening-variant-theme.ts

### openings

#### components

- opening-board-card.tsx
- opening-main-sidebar

##### opening-main-sidebar.tsx

- opening-variant-controller.tsx
- opening-variant-sidebar

##### opening-variant-sidebar.tsx

#### constants

- opening-variant-controller.constants.ts

#### hooks

- use-move-evaluation.ts
- use-opening-variant-tour.ts

#### lib

#### mapper

- opening-variant.mapper.ts

#### repository

- opening-variant.repository.ts
- opening.repository.ts

#### services

- openings.service.ts

#### store

- openings-store.ts

#### tours

- opening-variant-tour-steps.ts

#### types

- filter-types.ts
- opening-variant.ts
- opening.ts

#### utils

#### validation

- opening-variant-goals.ts

### profile

#### actions

- increment-current-rating.ts

#### components

- profile-page.tsx
- user-avatar.tsx

#### hooks

- use-profile.ts

#### repository

- profile.repository.ts

#### services

- profile.service.ts

#### types

- profile-onboarding-status.ts
- profile.ts
- user-profile.ts

#### utilities

- user-avatar.ts

### riddle

#### actions

- add-riddle-to-my-collection.ts

#### components

- add-to-my-collection-picker.tsx
- riddle-board-card.tsx
- riddle-controller.tsx
- riddles-list-with-filter.tsx
- riddles-theme-filter.tsx

#### constants

- riddle-accuracy.constants.ts
- riddles-list.constants.ts

#### hooks

- use-riddle-tour.ts

#### mapper

- riddle.mapper.ts

#### repository

- riddle.repository.ts

#### services

- riddle-list.service.ts
- riddle-page.service.ts
- riddle.service.ts

#### tours

- riddle-tour-steps.ts

#### types

- riddle-rating.ts
- riddle-with-themes.ts
- riddle.ts

#### utilities

- build-riddle-path.ts
- game-type-helpers.ts
- get-parent-collection-url.ts
- parse-riddle-popularity.ts

### riddle-theme

#### mapper

- riddle-theme.mapper.ts

#### repository

- riddle-theme.repository.ts

#### services

- riddle-theme.service.ts

#### types

- riddle-theme.ts

### theme

#### components

- theme-badge.tsx
- theme-category-select.tsx
- theme-list.tsx
- theme-select.tsx

#### mapper

- theme.mapper.ts

#### repository

- theme.repository.ts

#### services

- theme.service.ts

#### types

- theme-category.ts
- theme.ts

### theme-link

#### components

- theme-link-kind-select.tsx
- theme-link-weight-select.tsx

#### services

- theme-link-admin.service.ts

#### types

- admin-theme-link.ts
- theme-link-kind.ts
- theme-link-weight.ts

### tts

#### api

- tts.ts

#### components

- tts-controller

##### tts-controller.tsx

#### utilities

- resolve-tts-audio.ts
- tts-cache.ts
- tts-config.ts
- tts-storage.ts

### user-collection

#### components

- create-user-list-dialog.tsx
- delete-user-list-dialog.tsx
- edit-user-list-dialog.tsx
- user-collection-card.tsx
- user-collection-list.tsx

#### utilities

### user-onboarding-answer

#### actions

- save-user-onboarding-answer.ts

#### components

- onboarding-answer-picker.tsx
- user-onboarding-answers-summary.tsx

#### mapper

- user-onboarding-answer.mapper.ts

#### repository

- user-onboarding-answer.repository.ts

#### services

- user-onboarding-answer.service.ts

#### types

- user-onboarding-answer.ts

### user-practice-opening-variant

#### actions

- add-opening-variant-to-practice.ts

#### components

- add-to-practice-button.tsx
- user-practice-opening-variant.tsx

#### mapper

- user-practice-opening-variant.mapper.ts

#### repository

- user-practice-opening-variant.repository.ts

#### services

- add-opening-variant-to-user-practice.ts
- user-practice-opening-variant.service.ts

#### types

- user-practice-opening-variant.ts

### user-sequence-attempt

#### api

- sequence-attempt.ts

#### hooks

- use-sequence-attempt.ts

#### mapper

- user-sequence-attempt.mapper.ts

#### repository

- user-sequence-attempt.repository.ts

#### services

- user-sequence-attempt.service.ts

#### types

- riddle-attempt-status.ts
- sequence-complete-dialog-stats.ts
- user-sequence-attempt.ts

#### utilities

- attempt-status.ts
- compute-sequence-attempt-accuracy.ts
- create-attempt-payload.ts
- format-attempt-duration.ts
- map-attempt-stats-by-sequence-id.ts
- to-sequence-attempt-stats.ts
- update-correct-streak.ts

### user-sequence-attempt-event

#### mapper

- user-sequence-attempt-event.mapper.ts

#### repository

- user-sequence-attempt-event.repository.ts

#### services

- user-sequence-attempt-event.service.ts

#### types

- sequence-attempt-event-type.ts
- user-sequence-attempt-event.ts

## hooks

- use-counter.ts
- use-mobile.ts

## lib

### admin

- parse-goals-from-form.ts
- riddle-errors.ts

### chess

- buildUci.ts
- getFenFromPgnAtPly.ts
- getFullMoveCountFromMoves.ts
- getOrientationFromFen.ts
- getPlyFromPgnAtFen.ts
- getPromotionPiece.ts
- getUciMovesArrayFromPgn.ts
- getUciMovesFromPgnAfterPly.ts
- getUciMovesFromPgnAfterPlyAtMoveCount.ts

### hooks

- use-chess.ts
- parsePgn.ts
- parseUci.ts
- toDests.ts

### chessground

#### hooks

- use-chessgroud.ts

### engine

- create-engine.ts

#### hooks

- use-stockfish-engine.ts
- parse-engine.ts

### ollama

- client.ts
- generate-move-sequence-goals.ts

### open-ai

- ai.config.ts
- concate-prompt.ts
- open-ai.ts

### shared

#### constants

- chess.ts
- game-type-details.ts
- opening-type-copy.ts

#### hooks

##### sound

- use-achievement-sound.ts
- use-board-sounds.ts
- use-sound.ts

##### tour

- product-tour-config.ts
- use-product-tour.ts
- use-mobile.ts

#### store

- board-sounds-store.ts
- coach-store.ts

#### tour

- data-tour.ts

#### types

- engine-info.ts
- game-difficulty.ts
- game-status.ts
- move-attempt-payload.ts
- move-evaluation-payload.ts
- move.ts

### supabase

- admin.ts
- auth.ts
- client.ts
- middleware.ts
- postgrest-user-message.ts
- server.ts

### utils

- cn.ts
- getMoveFeedbackClass.ts
- getMoveQuality.ts
- groupBy.ts
- shuffle.ts
- slugify.ts
- utils.ts

## middleware.ts

## next-env.d.ts

## next.config.ts

## package-lock.json

## package.json

## postcss.config.mjs

## skills-lock.json

## tsconfig.json

## tsconfig.tsbuildinfo
