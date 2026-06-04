/**
 * User Practice Opening Variant Repository
 *
 * Responsibility: CRUD access to the user_practice_opening_variants table.
 */

import {
  toUserPracticeOpeningVariant,
  toUserPracticeOpeningVariants,
  toUserPracticeOpeningVariantsWithDetails,
  toUserPracticeOpeningVariantWithDetails,
  type DbUserPracticeOpeningVariant,
  type DbUserPracticeOpeningVariantWithDetails,
} from "@/features/user-practice-opening-variant/mapper/user-practice-opening-variant.mapper";
import type {
  SaveUserPracticeOpeningVariantInput,
  UpdateUserPracticeOpeningVariantInput,
  UserPracticeOpeningVariant,
  UserPracticeOpeningVariantWithDetails,
} from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";
import type { SupabaseClient } from "@supabase/supabase-js";

const ROW_SELECT = "*";
const ROW_WITH_DETAILS_SELECT = "*, opening_variants (*, move_sequences (*))";

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<UserPracticeOpeningVariant | null> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .select(ROW_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("user-practice-opening-variant.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toUserPracticeOpeningVariant(data as DbUserPracticeOpeningVariant);
}

export async function findByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<UserPracticeOpeningVariantWithDetails | null> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .select(ROW_WITH_DETAILS_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("user-practice-opening-variant.repository.findByIdWithDetails error:", error);
    return null;
  }

  if (!data) return null;

  return toUserPracticeOpeningVariantWithDetails(data as DbUserPracticeOpeningVariantWithDetails);
}

export async function findByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariant[]> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .select(ROW_SELECT)
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-practice-opening-variant.repository.findByUserId error:", error);
    return [];
  }

  return toUserPracticeOpeningVariants((data ?? []) as DbUserPracticeOpeningVariant[]);
}

export async function findActiveByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPracticeOpeningVariant[]> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .select(ROW_SELECT)
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-practice-opening-variant.repository.findActiveByUserId error:", error);
    return [];
  }

  return toUserPracticeOpeningVariants((data ?? []) as DbUserPracticeOpeningVariant[]);
}

export async function findByUserIdWithDetails(
  supabase: SupabaseClient,
  userId: string,
  options?: { activeOnly?: boolean },
): Promise<UserPracticeOpeningVariantWithDetails[]> {
  let query = supabase
    .from("user_practice_opening_variants")
    .select(ROW_WITH_DETAILS_SELECT)
    .eq("user_id", userId);

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("user-practice-opening-variant.repository.findByUserIdWithDetails error:", error);
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
    .select(ROW_SELECT)
    .eq("user_id", userId)
    .eq("opening_variant_id", openingVariantId)
    .maybeSingle();

  if (error) {
    console.error(
      "user-practice-opening-variant.repository.findByUserAndOpeningVariantId error:",
      error,
    );
    return null;
  }

  if (!data) return null;

  return toUserPracticeOpeningVariant(data as DbUserPracticeOpeningVariant);
}

export async function upsert(
  supabase: SupabaseClient,
  input: SaveUserPracticeOpeningVariantInput,
): Promise<UserPracticeOpeningVariant | null> {
  const { data, error } = await supabase
    .from("user_practice_opening_variants")
    .upsert(
      {
        user_id: input.userId,
        opening_variant_id: input.openingVariantId,
        is_active: input.isActive ?? true,
        sort_order: input.sortOrder ?? 0,
      },
      { onConflict: "user_id,opening_variant_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("user-practice-opening-variant.repository.upsert error:", error);
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

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("user_practice_opening_variants").delete().eq("id", id);

  if (error) {
    console.error("user-practice-opening-variant.repository.remove error:", error);
    return false;
  }

  return true;
}

export async function removeByUserId(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("user_practice_opening_variants")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("user-practice-opening-variant.repository.removeByUserId error:", error);
    return false;
  }

  return true;
}
