/**
 * User Favourites Repository
 *
 * Responsibility: CRUD access to the user_favourites table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbUserFavourite,
  type DbUserFavouriteWithDetails,
  toUserFavourite,
  toUserFavouritesWithDetails,
} from "@/features/user-favourites/mapper/user-favourite.mapper";
import type {
  SaveUserFavouriteInput,
  UserFavourite,
  UserFavouriteWithDetails,
} from "@/features/user-favourites/types/user-favourite";

export async function findByUserIdWithDetails(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserFavouriteWithDetails[]> {
  const { data, error } = await supabase
    .from("user_favourites")
    .select("*, opening_variants (*, move_sequences (*)), riddles (*, move_sequences (*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-favourites.repository.findByUserIdWithDetails error:", error);
    return [];
  }

  return toUserFavouritesWithDetails((data ?? []) as DbUserFavouriteWithDetails[]);
}

export async function findByUserAndOpeningVariantId(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
): Promise<UserFavourite | null> {
  const { data, error } = await supabase
    .from("user_favourites")
    .select("*")
    .eq("user_id", userId)
    .eq("opening_variant_id", openingVariantId)
    .maybeSingle();

  if (error) {
    console.error("user-favourites.repository.findByUserAndOpeningVariantId error:", error);
    return null;
  }

  if (!data) return null;

  return toUserFavourite(data as DbUserFavourite);
}

export async function findByUserAndRiddleId(
  supabase: SupabaseClient,
  userId: string,
  riddleId: string,
): Promise<UserFavourite | null> {
  const { data, error } = await supabase
    .from("user_favourites")
    .select("*")
    .eq("user_id", userId)
    .eq("riddle_id", riddleId)
    .maybeSingle();

  if (error) {
    console.error("user-favourites.repository.findByUserAndRiddleId error:", error);
    return null;
  }

  if (!data) return null;

  return toUserFavourite(data as DbUserFavourite);
}

export async function create(
  supabase: SupabaseClient,
  input: SaveUserFavouriteInput,
): Promise<UserFavourite | null> {
  const { data, error } = await supabase
    .from("user_favourites")
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
    console.error("user-favourites.repository.create error:", error);
    return null;
  }

  return toUserFavourite(data as DbUserFavourite);
}

export async function deleteById(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("user_favourites").delete().eq("id", id);

  if (error) {
    console.error("user-favourites.repository.deleteById error:", error);
    return false;
  }

  return true;
}
