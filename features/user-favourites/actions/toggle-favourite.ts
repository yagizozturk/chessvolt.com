"use server";

import { revalidatePath } from "next/cache";

import { toggleFavourite } from "@/features/user-favourites/services/toggle-favourite";
import type { ToggleFavouriteResult } from "@/features/user-favourites/services/toggle-favourite";
import type { ToggleFavouriteTarget } from "@/features/user-favourites/types/user-favourite";
import { getPublicUser } from "@/lib/supabase/auth";

export type ToggleFavouriteActionResult =
  | ToggleFavouriteResult
  | { ok: false; reason: "unauthorized" };

export async function toggleFavouriteAction(
  target: ToggleFavouriteTarget,
): Promise<ToggleFavouriteActionResult> {
  const { user, supabase } = await getPublicUser();

  if (!user) {
    return { ok: false, reason: "unauthorized" };
  }

  const result = await toggleFavourite(supabase, {
    userId: user.id,
    ...target,
  });

  if (result.ok) {
    if ("openingVariantId" in target && target.openingVariantId) {
      revalidatePath(`/openings/variant/${target.openingVariantId}`);
    }
    if ("riddleId" in target && target.riddleId) {
      revalidatePath(`/riddles/${target.riddleId}`);
      revalidatePath("/collection", "layout");
    }
    revalidatePath("/volts");
  }

  return result;
}
