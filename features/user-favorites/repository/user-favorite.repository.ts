/**
 * User Favourites Repository
 *
 * Responsibility: CRUD access to the user_favorites table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbUserFavorite,
  type DbUserFavoriteWithDetails,
  toUserFavorite,
  toUserFavoritesWithDetails,
} from "@/features/user-favorites/mapper/user-favorite.mapper";
import type {
  SaveUserFavoriteInput,
  UserFavorite,
  UserFavoriteWithDetails,
} from "@/features/user-favorites/types/user-favorite";

export async function findByUserIdWithDetails(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserFavoriteWithDetails[]> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*, opening_variants (*, move_sequences (*)), riddles (*, move_sequences (*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-favorites.repository.findByUserIdWithDetails error:", error);
    return [];
  }

  return toUserFavoritesWithDetails((data ?? []) as DbUserFavoriteWithDetails[]);
}

export async function findByUserAndOpeningVariantId(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
): Promise<UserFavorite | null> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("opening_variant_id", openingVariantId)
    .maybeSingle();

  if (error) {
    console.error("user-favorites.repository.findByUserAndOpeningVariantId error:", error);
    return null;
  }

  if (!data) return null;

  return toUserFavorite(data as DbUserFavorite);
}

// ==================================================================
// Checking if riddle id is favorited
// ==================================================================
export async function findByRiddleId(
  supabase: SupabaseClient,
  userId: string,
  riddleId: string,
): Promise<UserFavorite | null> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("riddle_id", riddleId)
    .maybeSingle();

  if (error) {
    console.error("user-favorites.repository.findByRiddleId error:", error);
    return null;
  }

  if (!data) return null;

  return toUserFavorite(data as DbUserFavorite);
}

export async function create(supabase: SupabaseClient, input: SaveUserFavoriteInput): Promise<UserFavorite | null> {
  const { data, error } = await supabase
    .from("user_favorites")
    .insert({
      user_id: input.userId,
      opening_variant_id: input.openingVariantId ?? null,
      riddle_id: input.riddleId ?? null,
      is_pinned: input.isPinned ?? false,
      note: input.note ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("user-favorites.repository.create error:", error);
    return null;
  }

  return toUserFavorite(data as DbUserFavorite);
}

export async function deleteById(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("user_favorites").delete().eq("id", id);

  if (error) {
    console.error("user-favorites.repository.deleteById error:", error);
    return false;
  }

  return true;
}
