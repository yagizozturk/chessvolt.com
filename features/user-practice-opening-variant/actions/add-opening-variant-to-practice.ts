"use server";

import { revalidatePath } from "next/cache";

import { addOpeningVariantToUserPractice } from "@/features/user-practice-opening-variant/services/add-opening-variant-to-user-practice";
import type { AddOpeningVariantToUserPracticeResult } from "@/features/user-practice-opening-variant/services/add-opening-variant-to-user-practice";
import { getPublicUser } from "@/lib/supabase/auth";

export async function addOpeningVariantToPracticeAction(
  openingVariantId: string,
): Promise<AddOpeningVariantToUserPracticeResult> {
  const { user, supabase } = await getPublicUser();

  if (!user) {
    return { ok: false, reason: "unauthorized" };
  }

  const result = await addOpeningVariantToUserPractice(supabase, {
    userId: user.id,
    openingVariantId,
  });

  if (result.ok) {
    revalidatePath(`/openings/variant/${openingVariantId}`);
    revalidatePath("/my-volts");
  }

  return result;
}
