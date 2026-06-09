/**
 * User Practice Opening Variant Service
 *
 * Responsibility: Business logic for user_practice_opening_variants rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as userPracticeOpeningVariantRepo from "@/features/user-practice-opening-variant/repository/user-practice-opening-variant.repository";
import type {
  SaveUserPracticeOpeningVariantInput,
  UpdateUserPracticeOpeningVariantInput,
  UserPracticeOpeningVariant,
  UserPracticeOpeningVariantWithDetails,
} from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

export async function getUserPracticeOpeningVariantById(
  supabase: SupabaseClient,
  id: string,
): Promise<UserPracticeOpeningVariant | null> {
  return userPracticeOpeningVariantRepo.findById(supabase, id);
}

export async function getUserPracticeOpeningVariantByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<UserPracticeOpeningVariantWithDetails | null> {
  return userPracticeOpeningVariantRepo.findByIdWithDetails(supabase, id);
}

export async function getUserPracticeOpeningVariantsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariant[]> {
  return userPracticeOpeningVariantRepo.findByUserId(supabase, userId);
}

export async function getActiveUserPracticeOpeningVariantsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariant[]> {
  return userPracticeOpeningVariantRepo.findActiveByUserId(supabase, userId);
}

// ================================================================================================
// Getting user practice opening variants by user id with sequences
// ================================================================================================
export async function getUserPracticeOpeningVariantsForUserWithSequences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariantWithDetails[]> {
  return userPracticeOpeningVariantRepo.findByUserIdWithSequences(supabase, userId);
}

// ================================================================================================
// Getting active user practice opening variants by user id with sequences
// ================================================================================================
export async function getActiveUserPracticeOpeningVariantsForUserWithSequences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariantWithDetails[]> {
  return userPracticeOpeningVariantRepo.findActiveByUserIdWithSequences(supabase, userId);
}

export async function getUserPracticeOpeningVariantByUserAndOpeningVariant(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
): Promise<UserPracticeOpeningVariant | null> {
  return userPracticeOpeningVariantRepo.findByUserAndOpeningVariantId(supabase, userId, openingVariantId);
}

export async function getUserPracticeOpeningVariantsByOpeningVariantId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Record<string, UserPracticeOpeningVariant>> {
  const rows = await userPracticeOpeningVariantRepo.findByUserId(supabase, userId);
  const byOpeningVariantId: Record<string, UserPracticeOpeningVariant> = {};
  for (const row of rows) {
    byOpeningVariantId[row.openingVariantId] = row;
  }
  return byOpeningVariantId;
}

export async function saveUserPracticeOpeningVariant(
  supabase: SupabaseClient,
  input: SaveUserPracticeOpeningVariantInput,
): Promise<UserPracticeOpeningVariant | null> {
  return userPracticeOpeningVariantRepo.upsert(supabase, input);
}

export async function updateUserPracticeOpeningVariant(
  supabase: SupabaseClient,
  id: string,
  input: UpdateUserPracticeOpeningVariantInput,
): Promise<UserPracticeOpeningVariant | null> {
  return userPracticeOpeningVariantRepo.update(supabase, id, input);
}

export async function deleteUserPracticeOpeningVariant(supabase: SupabaseClient, id: string): Promise<boolean> {
  return userPracticeOpeningVariantRepo.remove(supabase, id);
}

export async function deleteUserPracticeOpeningVariantsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  return userPracticeOpeningVariantRepo.removeByUserId(supabase, userId);
}

export function isOpeningVariantInPracticeList(rows: UserPracticeOpeningVariant[], openingVariantId: string): boolean {
  return rows.some((row) => row.openingVariantId === openingVariantId && row.isActive);
}
