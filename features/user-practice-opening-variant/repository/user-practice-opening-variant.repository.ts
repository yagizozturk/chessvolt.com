// TODO: Refactor
/**
 * User Practice Opening Variant Repository
 *
 * Responsibility: CRUD access to the user_practice_opening_variants table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbUserPracticeOpeningVariant,
  type DbUserPracticeOpeningVariantWithDetails,
  toUserPracticeOpeningVariant,
  toUserPracticeOpeningVariants,
  toUserPracticeOpeningVariantsWithDetails,
} from "@/features/user-practice-opening-variant/mapper/user-practice-opening-variant.mapper";
import type {
  SaveUserPracticeOpeningVariantInput,
  UpdateUserPracticeOpeningVariantInput,
  UserPracticeOpeningVariant,
  UserPracticeOpeningVariantWithDetails,
} from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

export async function findById(supabase: SupabaseClient, id: string): Promise<UserPracticeOpeningVariant | null> {
  const { data, error } = await supabase.from("user_practice_opening_variants").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("user-practice-opening-variant.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toUserPracticeOpeningVariant(data as DbUserPracticeOpeningVariant);
}

export async function findByUserId(supabase: SupabaseClient, userId: string): Promise<UserPracticeOpeningVariant[]> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-practice-opening-variant.repository.findByUserId error:", error);
    return [];
  }

  return toUserPracticeOpeningVariants((data ?? []) as DbUserPracticeOpeningVariant[]);
}

export async function findByUserIdWithSequences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariantWithDetails[]> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .select("*, opening_variants (*, move_sequences (*))")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-practice-opening-variant.repository.findByUserIdWithSequences error:", error);
    return [];
  }

  return toUserPracticeOpeningVariantsWithDetails((data ?? []) as DbUserPracticeOpeningVariantWithDetails[]);
}

export async function findByUserAndOpeningVariantId(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
): Promise<UserPracticeOpeningVariant | null> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .select("*")
    .eq("user_id", userId)
    .eq("opening_variant_id", openingVariantId)
    .maybeSingle();

  if (error) {
    console.error("user-practice-opening-variant.repository.findByUserAndOpeningVariantId error:", error);
    return null;
  }

  if (!data) return null;

  return toUserPracticeOpeningVariant(data as DbUserPracticeOpeningVariant);
}

export async function create(
  supabase: SupabaseClient,
  input: SaveUserPracticeOpeningVariantInput,
): Promise<UserPracticeOpeningVariant | null> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .insert({
      user_id: input.userId,
      opening_variant_id: input.openingVariantId,
      is_active: input.isActive ?? true,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("user-practice-opening-variant.repository.create error:", error);
    return null;
  }

  return toUserPracticeOpeningVariant(data as DbUserPracticeOpeningVariant);
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateUserPracticeOpeningVariantInput,
): Promise<UserPracticeOpeningVariant | null> {
  const updates: Record<string, unknown> = {};
  if (input.isActive !== undefined) updates.is_active = input.isActive;
  if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("user-practice-opening-variant.repository.update error:", error);
    return null;
  }

  return toUserPracticeOpeningVariant(data as DbUserPracticeOpeningVariant);
}
