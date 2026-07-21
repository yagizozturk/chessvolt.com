/**
 * User Favourites Service
 *
 * Responsibility: Business logic for user_favourites rows.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as userFavouriteRepo from "@/features/user-favourites/repository/user-favourite.repository";
import type {
  UserFavourite,
  UserFavouriteWithDetails,
} from "@/features/user-favourites/types/user-favourite";

export async function getUserFavouritesForUserWithDetails(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserFavouriteWithDetails[]> {
  return userFavouriteRepo.findByUserIdWithDetails(supabase, userId);
}

export async function getUserFavouriteByUserAndOpeningVariant(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
): Promise<UserFavourite | null> {
  return userFavouriteRepo.findByUserAndOpeningVariantId(supabase, userId, openingVariantId);
}

export async function getUserFavouriteByUserAndRiddle(
  supabase: SupabaseClient,
  userId: string,
  riddleId: string,
): Promise<UserFavourite | null> {
  return userFavouriteRepo.findByUserAndRiddleId(supabase, userId, riddleId);
}
