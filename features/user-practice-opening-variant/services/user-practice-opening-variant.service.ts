// TODO: Refactor
/**
 * User Practice Opening Variant Service
 *
 * Responsibility: Business logic for user_practice_opening_variants rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as userPracticeOpeningVariantRepo from "@/features/user-practice-opening-variant/repository/user-practice-opening-variant.repository";
import type {
  UserPracticeOpeningVariant,
  UserPracticeOpeningVariantWithDetails,
} from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

export async function getUserPracticeOpeningVariantsForUserWithSequences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariantWithDetails[]> {
  return userPracticeOpeningVariantRepo.findByUserIdWithSequences(supabase, userId);
}

export async function getUserPracticeOpeningVariantByUserAndOpeningVariant(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
): Promise<UserPracticeOpeningVariant | null> {
  return userPracticeOpeningVariantRepo.findByUserAndOpeningVariantId(supabase, userId, openingVariantId);
}
