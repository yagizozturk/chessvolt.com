// TODO: Refactor
import * as userPracticeOpeningVariantRepo from "@/features/user-practice-opening-variant/repository/user-practice-opening-variant.repository";
import type { UserPracticeOpeningVariant } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AddOpeningVariantToUserPracticeResult =
  | { ok: true; row: UserPracticeOpeningVariant }
  | { ok: false; reason: "unauthorized" | "invalid_variant_id" | "already_added" | "failed" };

export async function addOpeningVariantToUserPractice(
  supabase: SupabaseClient,
  input: { userId: string; openingVariantId: string },
): Promise<AddOpeningVariantToUserPracticeResult> {
  const openingVariantId = input.openingVariantId.trim();
  if (!openingVariantId) {
    return { ok: false, reason: "invalid_variant_id" };
  }

  const existing = await userPracticeOpeningVariantRepo.findByUserAndOpeningVariantId(
    supabase,
    input.userId,
    openingVariantId,
  );

  if (existing?.isActive) {
    return { ok: false, reason: "already_added" };
  }

  if (existing) {
    const row = await userPracticeOpeningVariantRepo.update(supabase, existing.id, { isActive: true });
    if (!row) {
      return { ok: false, reason: "failed" };
    }
    return { ok: true, row };
  }

  const practiceRows = await userPracticeOpeningVariantRepo.findByUserId(supabase, input.userId);
  const sortOrder =
    practiceRows.length === 0 ? 0 : Math.max(...practiceRows.map((row) => row.sortOrder)) + 1;

  const row = await userPracticeOpeningVariantRepo.create(supabase, {
    userId: input.userId,
    openingVariantId,
    isActive: true,
    sortOrder,
  });

  if (!row) {
    return { ok: false, reason: "failed" };
  }

  return { ok: true, row };
}
