"use server";

import { revalidatePath } from "next/cache";

import { toggleFavorite } from "@/features/user-favorites/services/toggle-favorite";
import type { ToggleFavoriteResult } from "@/features/user-favorites/services/toggle-favorite";
import type { ToggleFavoriteTarget } from "@/features/user-favorites/types/user-favorite";
import { getPublicUser } from "@/lib/supabase/auth";

export type ToggleFavoriteActionResult =
  | ToggleFavoriteResult
  | { ok: false; reason: "unauthorized" };

export async function toggleFavoriteAction(
  target: ToggleFavoriteTarget,
): Promise<ToggleFavoriteActionResult> {
  const { user, supabase } = await getPublicUser();

  if (!user) {
    return { ok: false, reason: "unauthorized" };
  }

  const result = await toggleFavorite(supabase, {
    userId: user.id,
    ...target,
  });

  if (result.ok) {
    if ("openingVariantId" in target && target.openingVariantId) {
      revalidatePath(`/openings/variant/${target.openingVariantId}`);
    }
    revalidatePath("/volt-tracker");
  }

  return result;
}
