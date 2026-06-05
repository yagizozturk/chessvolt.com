/**
 * Onboarding Route Utilities
 *
 * Path-matching helpers used by middleware to decide onboarding redirects.
 * These are pure string checks — no database or auth calls.
 */

import {
  AUTH_PATH_PREFIXES,
  DASHBOARD_PATH_PREFIXES,
  ONBOARDING_PATH,
} from "@/features/onboarding/constants/onboarding-routes";

// ============================================================================
// isAuthPath
//
// Returns true when the request pathname is a login/signup/callback route.
// Used to avoid redirecting unauthenticated users to onboarding while they
// are still signing in.
// ============================================================================
export function isAuthPath(pathname: string): boolean {
  return AUTH_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// ============================================================================
// isAdminPath
//
// Returns true for /admin and all nested admin routes. Admin users skip the
// onboarding gate so they can manage content before completing onboarding.
// ============================================================================
export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

// ============================================================================
// isOnboardingPath
//
// Returns true only for the exact onboarding page path (not sub-routes).
// Middleware uses this to redirect already-onboarded users away from the form.
// ============================================================================
export function isOnboardingPath(pathname: string): boolean {
  return pathname === ONBOARDING_PATH;
}

// ============================================================================
// isDashboardPath
//
// Returns true for app areas that require onboarding to be completed first
// (e.g. home, practice). Incomplete users hitting these paths get sent to
// /onboarding instead.
// ============================================================================
export function isDashboardPath(pathname: string): boolean {
  return DASHBOARD_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// ============================================================================
// shouldSkipOnboardingCheck
//
// Returns true when middleware should not read profiles.onboarding_completed.
// Skips auth flows, admin panel, and internal /http API routes so those
// requests are never blocked or redirected by onboarding policy.
// ============================================================================
export function shouldSkipOnboardingCheck(pathname: string): boolean {
  return isAuthPath(pathname) || isAdminPath(pathname) || pathname.startsWith("/http");
}
