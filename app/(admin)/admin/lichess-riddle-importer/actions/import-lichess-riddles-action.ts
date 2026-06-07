"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { importLichessRiddlesFromCsv } from "@/app/(admin)/admin/lichess-riddle-importer/import/import-lichess-riddles";
import { DEFAULT_LICHESS_IMPORT_CONFIG } from "@/app/(admin)/admin/lichess-riddle-importer/import/lichess-import.config";
import { getAdminUser } from "@/lib/supabase/auth";

export async function importLichessRiddlesAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const csvText = String(formData.get("csvData") ?? "").trim();
  if (!csvText) {
    redirect("/admin/lichess-riddle-importer?error=missing_csv");
  }

  const minPopularityRaw = Number(formData.get("minPopularity"));
  const minPopularity =
    Number.isFinite(minPopularityRaw) && minPopularityRaw >= 0
      ? minPopularityRaw
      : DEFAULT_LICHESS_IMPORT_CONFIG.minPopularity;

  const summary = await importLichessRiddlesFromCsv(supabase, csvText, {
    ...DEFAULT_LICHESS_IMPORT_CONFIG,
    minPopularity,
  });

  const params = new URLSearchParams({
    imported: String(summary.imported),
    skippedDuplicate: String(summary.skippedDuplicate),
    skippedFilter: String(summary.skippedFilter),
    errors: String(summary.errors),
  });

  if (summary.unknownLichessThemes.length > 0) {
    params.set("unknownThemes", JSON.stringify(summary.unknownLichessThemes.slice(0, 200)));
  }

  if (summary.errors > 0) {
    const errorRows = summary.rowResults.filter((r) => r.status === "error").slice(0, 50);
    params.set("errorDetails", JSON.stringify(errorRows));
  }

  revalidatePath("/admin/riddles");
  revalidatePath("/admin/lichess-riddle-importer");
  redirect(`/admin/lichess-riddle-importer?${params.toString()}`);
}
