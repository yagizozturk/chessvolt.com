// ================================================================================================
// Profil alanı limitleri. Server Action'lardaki (update-username, update-platform-usernames)
// limitlerle aynı; /http/profile/* route'ları bunları kullanır.
// ================================================================================================
export const MAX_USERNAME_LENGTH = 50;
export const MAX_PLATFORM_USERNAME_LENGTH = 50;

// ================================================================================================
// profiles.initial_rating DB check constraint'i (profiles_initial_rating_check) 100–3000 dışını reddeder.
// ================================================================================================
export const MIN_INITIAL_RATING = 100;
export const MAX_INITIAL_RATING = 3000;
