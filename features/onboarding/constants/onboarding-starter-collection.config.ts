/** Fixed slug so onboarding starter collections are idempotent per user. */
export const ONBOARDING_STARTER_COLLECTION_SLUG = "onboarding-starter";
export const ONBOARDING_STARTER_COLLECTION_TITLE = "Starter Collection";
/** Q3 option values for "Do you want a starter collection?" */
export const ONBOARDING_STARTER_COLLECTION_ACCEPT_OPTION_VALUE = "yes_create_for_me";
export const ONBOARDING_STARTER_COLLECTION_DECLINE_OPTION_VALUE = "no_i_will_choose";
export function hasStarterCollection(option: { value: string }): boolean {
  return option.value === ONBOARDING_STARTER_COLLECTION_ACCEPT_OPTION_VALUE;
}
export const ONBOARDING_STARTER_COLLECTION_COVER_IMAGE = "collection-default-cover-image.png";
export const ONBOARDING_STARTER_COLLECTION_COVER_COLOR = "#5D37BF";
/** Primary rating window when matching riddles to the user's onboarding rating. */
export const ONBOARDING_RIDDLE_RATING_TOLERANCE = 200;
/** Wider window used when not enough riddles match within the primary tolerance. */
export const ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK = 400;
/** Target number of riddles placed in the starter collection. */
export const ONBOARDING_STARTER_COLLECTION_RIDDLE_LIMIT = 15;
/** Minimum matches before accepting a tier; otherwise fall back to the next tier. */
export const ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES = 5;
