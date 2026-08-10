export const ONBOARDING_PATH = "/onboarding";
export const DASHBOARD_HOME_URL = "/dashboard";
export const POST_LOGIN_URL = DASHBOARD_HOME_URL;
export const POST_ONBOARDING_URL = "/puzzles/dbd4158d-6313-4929-b4b5-d77c378b5c2d"; // Tutorial puzzle
export const AUTH_PATH_PREFIXES = ["/login", "/signup", "/forgot-password", "/auth"] as const;
export const DASHBOARD_PATH_PREFIXES = [
  DASHBOARD_HOME_URL,
  POST_ONBOARDING_URL,
  "/study",
  "/openings",
  "/puzzle",
  "/puzzles",
  "/volt-tracker",
  "/profile",
] as const;
