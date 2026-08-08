"use server";

import { revalidatePath } from "next/cache";

import { importLichessPuzzlesFromCsv } from "@/app/(admin)/admin/puzzles/lib/lichess/import-from-csv";
import { DEFAULT_LICHESS_IMPORT_CONFIG } from "@/app/(admin)/admin/puzzles/lib/lichess/types";
import type { LichessImportFormState } from "@/app/(admin)/admin/puzzles/lib/puzzle-form-state";
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

  const summary = await importLichessPuzzlesFromCsv(supabase, csvText, { minPopularity });

  revalidatePath("/admin/puzzles");
  revalidatePath("/study");

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
