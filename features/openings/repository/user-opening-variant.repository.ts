/**
 * User Opening Variant Repository
 *
 * Responsibility: CRUD access to the user_opening_variants table.
 * Manages user opening variant attempts (correct/incorrect).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { AttemptedOpeningVariant } from "@/features/openings/types/user-opening-variant";

/** Returns opening variant attempts with correct/incorrect status */
export async function findOpeningVariantAttempts(
  supabase: SupabaseClient,
  userId: string,
): Promise<AttemptedOpeningVariant[]> {
  const { data, error } = await supabase
    .from("user_opening_variants")
    .select("opening_variant_id, is_correct")
    .eq("user_id", userId);

  if (error) {
    console.error(
      "user-opening-variant.repository.findOpeningVariantAttempts error:",
      error,
    );
    return [];
  }

  return (
    data?.map((r) => ({
      openingVariantId: r.opening_variant_id,
      isCorrect: r.is_correct,
    })) ?? []
  );
}

/** Returns variant IDs that the user has solved correctly for a given opening */
export async function findCorrectlySolvedVariantIds(
  supabase: SupabaseClient,
  userId: string,
  openingVariantIds: string[],
): Promise<Set<string>> {
  if (openingVariantIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("user_opening_variants")
    .select("opening_variant_id")
    .eq("user_id", userId)
    .eq("is_correct", true)
    .in("opening_variant_id", openingVariantIds);

  if (error) {
    console.error(
      "user-opening-variant.repository.findCorrectlySolvedVariantIds error:",
      error,
    );
    return new Set();
  }

  return new Set(data?.map((r) => r.opening_variant_id) ?? []);
}

/** Saves or updates opening variant attempt (upsert) */
export async function upsert(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
  isCorrect: boolean,
  options?: { userMoveSan?: string | null; timeSpentSeconds?: number | null },
): Promise<void> {
  const { error } = await supabase.from("user_opening_variants").upsert(
    {
      user_id: userId,
      opening_variant_id: openingVariantId,
      is_correct: isCorrect,
      user_move_san: options?.userMoveSan ?? null,
      time_spent_seconds: options?.timeSpentSeconds ?? null,
    },
    {
      onConflict: "user_id,opening_variant_id",
    },
  );

  if (error) {
    console.error("user-opening-variant.repository.upsert error:", error);
    throw new Error(`Failed to update opening variant attempt: ${error.message}`);
  }
}
