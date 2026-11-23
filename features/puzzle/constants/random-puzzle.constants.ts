/** Solved puzzles skipped when choosing the next random puzzle for a logged-in user. */
export const RECENT_SOLVED_PUZZLE_COUNT = 10;

/** ± windows around the player's rating, tried narrowest first before falling back to any rating. */
export const PUZZLE_RATING_SEARCH_WINDOWS = [100, 200, 400] as const;

/** Random puzzles sampled per search so one the player has never solved can be preferred. */
export const RANDOM_PUZZLE_CANDIDATE_COUNT = 20;

export const PUZZLE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
