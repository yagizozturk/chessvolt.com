"use server";

import { revalidatePath } from "next/cache";

import { importLichessRiddlesFromCsv } from "@/app/(admin)/admin/riddles/lib/lichess/import-from-csv";
import { DEFAULT_LICHESS_IMPORT_CONFIG } from "@/app/(admin)/admin/riddles/lib/lichess/types";
import type { LichessImportFormState } from "@/app/(admin)/admin/riddles/lib/riddle-form-state";
import { getAdminUser } from "@/lib/supabase/auth";

export async function importLichessAction(
  _prevState: LichessImportFormState,
  formData: FormData,
): Promise<LichessImportFormState> {
  const { supabase } = await getAdminUser();

  const csvText = String(formData.get("csvData") ?? "").trim();
  if (!csvText) {
    return { error: "Paste Lichess CSV data to import." };
  }

  const minPopularityRaw = Number(formData.get("minPopularity"));
  const minPopularity =
    Number.isFinite(minPopularityRaw) && minPopularityRaw >= 0
      ? minPopularityRaw
      : DEFAULT_LICHESS_IMPORT_CONFIG.minPopularity;

  const summary = await importLichessRiddlesFromCsv(supabase, csvText, { minPopularity });

  revalidatePath("/admin/riddles");
  revalidatePath("/collection");

  return {
    error: null,
    summary: {
      imported: summary.imported,
      skippedDuplicate: summary.skippedDuplicate,
      skippedFilter: summary.skippedFilter,
      errors: summary.errors,
      unknownLichessThemes: summary.unknownLichessThemes.slice(0, 50),
    },
  };
}
