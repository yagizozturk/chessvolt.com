// TODO: Refactor
export const ONBOARDING_PATH = "/onboarding";
export const DASHBOARD_HOME_URL = "/dashboard";
export const POST_LOGIN_URL = DASHBOARD_HOME_URL;
export const POST_ONBOARDING_URL = DASHBOARD_HOME_URL;
export const AUTH_PATH_PREFIXES = ["/login", "/signup", "/forgot-password", "/auth"] as const;
export const DASHBOARD_PATH_PREFIXES = [
  DASHBOARD_HOME_URL,
  POST_ONBOARDING_URL,
  "/collection",
  "/openings",
  "/riddle",
  "/riddles",
  "/favorites",
  "/profile",
] as const;
