"use server";

import {
  backfillOpeningVariantGoalsGemini,
  type BackfillOpeningGoalsResult,
} from "@/features/openings/services/backfill-goals-gemini.service";
import { getAdminUser } from "@/lib/supabase/auth";

export type BackfillOpeningGoalsGeminiFormState = {
  error: string | null;
  result: BackfillOpeningGoalsResult | null;
};

export async function backfillOpeningVariantGoalsGeminiAction(
  _prevState: BackfillOpeningGoalsGeminiFormState,
  formData: FormData,
): Promise<BackfillOpeningGoalsGeminiFormState> {
  await getAdminUser();

  const limitRaw = Number(formData.get("limit"));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 1;
  const dryRun = formData.get("dryRun") === "on";
  const variantId = ((formData.get("variantId") as string) || "").trim() || undefined;

  try {
    const result = await backfillOpeningVariantGoalsGemini({ limit, dryRun, variantId });
    return { error: null, result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backfill failed";
    return { error: message, result: null };
  }
}
