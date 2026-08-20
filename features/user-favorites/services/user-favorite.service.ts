import type { SupabaseClient } from "@supabase/supabase-js";

import * as userFavoriteRepo from "@/features/user-favorites/repository/user-favorite.repository";
import type { UserFavorite, UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";

export async function getUserFavoritesForUserWithDetails(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserFavoriteWithDetails[]> {
  return userFavoriteRepo.findByUserIdWithDetails(supabase, userId);
}

export async function getUserFavoriteByUserAndOpeningVariant(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
): Promise<UserFavorite | null> {
  return userFavoriteRepo.findByUserAndOpeningVariantId(supabase, userId, openingVariantId);
}

// ==================================================================
// Checking if puzzle id is favorited by querying puzzle id in userFavorite repo
// ==================================================================
export async function getFavoriteByPuzzleId(
  supabase: SupabaseClient,
  userId: string,
  puzzleId: string,
): Promise<UserFavorite | null> {
  return userFavoriteRepo.findByPuzzleId(supabase, userId, puzzleId);
}

export async function getFavoritedOpeningVariantIds(
  supabase: SupabaseClient,
  userId: string,
  openingVariantIds: string[],
): Promise<Set<string>> {
  return userFavoriteRepo.findFavoritedOpeningVariantIds(supabase, userId, openingVariantIds);
}

export async function getFavoritedPuzzleIds(
  supabase: SupabaseClient,
  userId: string,
  puzzleIds: string[],
): Promise<Set<string>> {
  return userFavoriteRepo.findFavoritedPuzzleIds(supabase, userId, puzzleIds);
}
