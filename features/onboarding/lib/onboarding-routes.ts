export const ONBOARDING_PATH = "/onboarding";

const AUTH_PATH_PREFIXES = ["/login", "/signup", "/forgot-password", "/auth"] as const;

const DASHBOARD_PATH_PREFIXES = ["/collection", "/openings", "/riddle"] as const;

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isOnboardingPath(pathname: string): boolean {
  return pathname === ONBOARDING_PATH;
}

export function isDashboardPath(pathname: string): boolean {
  return DASHBOARD_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function shouldSkipOnboardingCheck(pathname: string): boolean {
  return isAuthPath(pathname) || isAdminPath(pathname) || pathname.startsWith("/http");
}
