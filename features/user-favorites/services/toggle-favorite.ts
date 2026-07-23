import type { SupabaseClient } from "@supabase/supabase-js";

import * as userFavouriteRepo from "@/features/user-favorites/repository/user-favorite.repository";
import type { ToggleFavoriteTarget, UserFavorite } from "@/features/user-favorites/types/user-favorite";

export type ToggleFavoriteResult =
  | { ok: true; favourited: boolean; row: UserFavorite | null }
  | { ok: false; reason: "invalid_target" | "failed" };

type ParsedTarget =
  | { kind: "opening_variant"; openingVariantId: string }
  | { kind: "riddle"; riddleId: string };

function parseTarget(target: ToggleFavoriteTarget): ParsedTarget | null {
  if ("openingVariantId" in target) {
    const openingVariantId = target.openingVariantId?.trim();
    if (!openingVariantId) return null;
    return { kind: "opening_variant", openingVariantId };
  }

  const riddleId = target.riddleId?.trim();
  if (!riddleId) return null;
  return { kind: "riddle", riddleId };
}

export async function toggleFavourite(
  supabase: SupabaseClient,
  input: { userId: string } & ToggleFavoriteTarget,
): Promise<ToggleFavoriteResult> {
  const target = parseTarget(input);
  if (!target) {
    return { ok: false, reason: "invalid_target" };
  }

  const existing =
    target.kind === "opening_variant"
      ? await userFavouriteRepo.findByUserAndOpeningVariantId(supabase, input.userId, target.openingVariantId)
      : await userFavouriteRepo.findByRiddleId(supabase, input.userId, target.riddleId);

  if (existing) {
    const deleted = await userFavouriteRepo.deleteById(supabase, existing.id);
    if (!deleted) {
      return { ok: false, reason: "failed" };
    }
    return { ok: true, favourited: false, row: null };
  }

  const row = await userFavouriteRepo.create(supabase, {
    userId: input.userId,
    openingVariantId: target.kind === "opening_variant" ? target.openingVariantId : null,
    riddleId: target.kind === "riddle" ? target.riddleId : null,
  });

  if (!row) {
    return { ok: false, reason: "failed" };
  }

  return { ok: true, favourited: true, row };
}
