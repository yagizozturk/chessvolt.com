// TODO: Refactor
/** Requires local@domain.tld — rejects values like `yunus@emre`. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

/** At least 8 chars with one letter and one number — firm but not annoying. */
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return PASSWORD_PATTERN.test(password);
}

export const PASSWORD_REQUIREMENT_TEXT =
  "Must be at least 8 characters and include a letter and a number.";

export const PASSWORD_REQUIREMENT_ERROR =
  "Password must be at least 8 characters and include a letter and a number.";
