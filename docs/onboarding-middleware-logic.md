// TODO: Refactor
# Onboarding Middleware Logic

## Why `middleware.ts` exists at project root

In Next.js, middleware is only executed when defined at the root as `middleware.ts` (or `src/middleware.ts`).

So we keep:

- `middleware.ts` as the framework entrypoint
- `lib/supabase/middleware.ts` as the actual implementation

The root file should stay thin and only delegate.

## Why middleware was needed for onboarding

The onboarding flow requires request-time redirects before page rendering:

- If user is logged in and `profiles.onboarding_completed = false`, block dashboard routes and redirect to `/onboarding`.
- If user is logged in and `profiles.onboarding_completed = true`, prevent returning to `/onboarding` and redirect to `/dashboard`.
- If user completes onboarding, redirect to `/user-collection` (starter collection).
- If user is not logged in and requests `/onboarding`, redirect to `/login`.

This is global route-gating behavior, which is best handled in middleware.

## File responsibilities

- `middleware.ts`
  - Next.js entrypoint.
  - Calls `updateSession(request)`.
  - Contains matcher configuration.

- `lib/supabase/middleware.ts`
  - Refreshes/reads Supabase auth session.
  - Applies redirect decisions based on auth + onboarding status.
  - Preserves cookies on redirects.

- `features/onboarding/lib/onboarding-routes.ts`
  - Onboarding-specific route policy helpers:
    - auth paths
    - dashboard paths
    - onboarding path
    - skip rules for non-app routes

## Best-practice summary

- Keep root `middleware.ts` minimal.
- Move business rules into feature modules.
- Keep middleware matcher narrow for performance.
- Use middleware for coarse redirects only.
- Keep server actions/pages protected independently (defense in depth).
