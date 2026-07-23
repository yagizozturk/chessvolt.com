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
// Checking if riddle id is favorited by querying riddle id in userFavorite repo
// ==================================================================
export async function getFavoriteByRiddleId(
  supabase: SupabaseClient,
  userId: string,
  riddleId: string,
): Promise<UserFavorite | null> {
  return userFavoriteRepo.findByRiddleId(supabase, userId, riddleId);
}
