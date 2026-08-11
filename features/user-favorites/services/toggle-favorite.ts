import type { SupabaseClient } from "@supabase/supabase-js";

import * as userFavoriteRepo from "@/features/user-favorites/repository/user-favorite.repository";
import type { ToggleFavoriteTarget, UserFavorite } from "@/features/user-favorites/types/user-favorite";

export type ToggleFavoriteResult =
  | { ok: true; favorited: boolean; row: UserFavorite | null }
  | { ok: false; reason: "invalid_target" | "failed" };

type ParsedTarget =
  | { kind: "opening_variant"; openingVariantId: string }
  | { kind: "puzzle"; puzzleId: string };

function parseTarget(target: ToggleFavoriteTarget): ParsedTarget | null {
  if ("openingVariantId" in target) {
    const openingVariantId = target.openingVariantId?.trim();
    if (!openingVariantId) return null;
    return { kind: "opening_variant", openingVariantId };
  }

  const puzzleId = target.puzzleId?.trim();
  if (!puzzleId) return null;
  return { kind: "puzzle", puzzleId };
}

export async function toggleFavorite(
  supabase: SupabaseClient,
  input: { userId: string } & ToggleFavoriteTarget,
): Promise<ToggleFavoriteResult> {
  const target = parseTarget(input);
  if (!target) {
    return { ok: false, reason: "invalid_target" };
  }

  const existing =
    target.kind === "opening_variant"
      ? await userFavoriteRepo.findByUserAndOpeningVariantId(supabase, input.userId, target.openingVariantId)
      : await userFavoriteRepo.findByPuzzleId(supabase, input.userId, target.puzzleId);

  if (existing) {
    const deleted = await userFavoriteRepo.deleteById(supabase, existing.id);
    if (!deleted) {
      return { ok: false, reason: "failed" };
    }
    return { ok: true, favorited: false, row: null };
  }

  const row = await userFavoriteRepo.create(supabase, {
    userId: input.userId,
    openingVariantId: target.kind === "opening_variant" ? target.openingVariantId : null,
    puzzleId: target.kind === "puzzle" ? target.puzzleId : null,
  });

  if (!row) {
    return { ok: false, reason: "failed" };
  }

  return { ok: true, favorited: true, row };
}
