import {
  AUTH_PATH_PREFIXES,
  DASHBOARD_PATH_PREFIXES,
  ONBOARDING_PATH,
} from "@/features/onboarding/constants/onboarding-routes";

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
