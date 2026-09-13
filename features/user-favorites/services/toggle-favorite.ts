import type { SupabaseClient } from "@supabase/supabase-js";

import * as userFavoriteRepo from "@/features/user-favorites/repository/user-favorite.repository";
import type { ToggleFavoriteTarget, UserFavorite } from "@/features/user-favorites/types/user-favorite";

export type ToggleFavoriteResult =
  | { ok: true; favorited: boolean; row: UserFavorite | null }
  | { ok: false; reason: "invalid_target" | "failed" };

type ParsedTarget =
  | { kind: "opening_variant"; openingVariantId: string }
  | { kind: "puzzle"; puzzleId: string }
  | { kind: "game_review_question"; gameReviewQuestionId: string };

function parseTarget(target: ToggleFavoriteTarget): ParsedTarget | null {
  if ("openingVariantId" in target) {
    const openingVariantId = target.openingVariantId?.trim();
    if (!openingVariantId) return null;
    return { kind: "opening_variant", openingVariantId };
  }

  if ("puzzleId" in target) {
    const puzzleId = target.puzzleId?.trim();
    if (!puzzleId) return null;
    return { kind: "puzzle", puzzleId };
  }

  const gameReviewQuestionId = target.gameReviewQuestionId?.trim();
  if (!gameReviewQuestionId) return null;
  return { kind: "game_review_question", gameReviewQuestionId };
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
      : target.kind === "puzzle"
        ? await userFavoriteRepo.findByPuzzleId(supabase, input.userId, target.puzzleId)
        : await userFavoriteRepo.findByGameReviewQuestionId(supabase, input.userId, target.gameReviewQuestionId);

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
    gameReviewQuestionId: target.kind === "game_review_question" ? target.gameReviewQuestionId : null,
  });

  if (!row) {
    return { ok: false, reason: "failed" };
  }

  return { ok: true, favorited: true, row };
}
