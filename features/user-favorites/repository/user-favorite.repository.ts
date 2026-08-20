/**
 * User Favorites Repository
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
    .select("*, opening_variants (*, move_sequences (*)), puzzles (*, move_sequences (*))")
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
// Checking if puzzle id is favorited
// ==================================================================
export async function findByPuzzleId(
  supabase: SupabaseClient,
  userId: string,
  puzzleId: string,
): Promise<UserFavorite | null> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("puzzle_id", puzzleId)
    .maybeSingle();

  if (error) {
    console.error("user-favorites.repository.findByPuzzleId error:", error);
    return null;
  }

  if (!data) return null;

  return toUserFavorite(data as DbUserFavorite);
}

export async function findFavoritedOpeningVariantIds(
  supabase: SupabaseClient,
  userId: string,
  openingVariantIds: string[],
): Promise<Set<string>> {
  if (openingVariantIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("user_favorites")
    .select("opening_variant_id")
    .eq("user_id", userId)
    .in("opening_variant_id", openingVariantIds);

  if (error) {
    console.error("user-favorites.repository.findFavoritedOpeningVariantIds error:", error);
    return new Set();
  }

  return new Set(
    (data ?? [])
      .map((row) => row.opening_variant_id as string | null)
      .filter((id): id is string => id != null),
  );
}

export async function findFavoritedPuzzleIds(
  supabase: SupabaseClient,
  userId: string,
  puzzleIds: string[],
): Promise<Set<string>> {
  if (puzzleIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("user_favorites")
    .select("puzzle_id")
    .eq("user_id", userId)
    .in("puzzle_id", puzzleIds);

  if (error) {
    console.error("user-favorites.repository.findFavoritedPuzzleIds error:", error);
    return new Set();
  }

  return new Set(
    (data ?? []).map((row) => row.puzzle_id as string | null).filter((id): id is string => id != null),
  );
}

export async function create(supabase: SupabaseClient, input: SaveUserFavoriteInput): Promise<UserFavorite | null> {
  const { data, error } = await supabase
    .from("user_favorites")
    .insert({
      user_id: input.userId,
      opening_variant_id: input.openingVariantId ?? null,
      puzzle_id: input.puzzleId ?? null,
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
