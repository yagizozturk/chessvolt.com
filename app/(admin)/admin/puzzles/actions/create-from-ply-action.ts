"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parsePuzzleMetadataFromForm } from "@/app/(admin)/admin/puzzles/lib/parse-puzzle-metadata";
import type { PuzzleFormState } from "@/app/(admin)/admin/puzzles/lib/puzzle-form-state";
import { createPuzzleFromPly } from "@/features/puzzle/services/create-puzzle-from-ply.service";
import { getAdminUser } from "@/lib/supabase/auth";

function parsePly(formData: FormData, key: string): number {
  const value = parseInt(String(formData.get(key) ?? ""), 10);
  return Number.isFinite(value) ? value : -1;
}

export async function createFromPlyAction(_prevState: PuzzleFormState, formData: FormData): Promise<PuzzleFormState> {
  const { supabase } = await getAdminUser();

  const meta = parsePuzzleMetadataFromForm(formData);
  if (!meta.ok) {
    return { error: meta.error };
  }

  const result = await createPuzzleFromPly(supabase, {
    pgn: ((formData.get("pgn") as string) || "").trim(),
    initialPly: parsePly(formData, "initialPly"),
    displayPly: parsePly(formData, "displayPly"),
    endPly: parsePly(formData, "endPly"),
    title: meta.data.title,
    rating: meta.data.rating,
    popularity: meta.data.popularity,
    themes: meta.data.themes,
    studyId: meta.data.studyId,
    goals: meta.data.goals,
    isActive: meta.data.isActive,
    gameId: meta.data.gameId,
    source: meta.data.source,
    sourceId: meta.data.sourceId,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/admin/puzzles");
  revalidatePath("/studies");
  redirect(`/admin/puzzles/${result.puzzleId}`);
}
