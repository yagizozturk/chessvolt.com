"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parsePuzzleMetadataFromForm } from "@/app/(admin)/admin/puzzles/lib/parse-puzzle-metadata";
import { persistNewPuzzle } from "@/app/(admin)/admin/puzzles/lib/persist-puzzle";
import { resolveFromPlySelection } from "@/app/(admin)/admin/puzzles/lib/resolve-puzzle-sequence";
import type { PuzzleFormState } from "@/app/(admin)/admin/puzzles/lib/puzzle-form-state";
import { buildStubGoalsFromMoves } from "@/lib/move-sequence-goals/build-stub-goals";
import { getAdminUser } from "@/lib/supabase/auth";

function parsePly(formData: FormData, key: string): number {
  const value = parseInt(String(formData.get(key) ?? ""), 10);
  return Number.isFinite(value) ? value : -1;
}

export async function createFromPlyAction(_prevState: PuzzleFormState, formData: FormData): Promise<PuzzleFormState> {
  const { supabase } = await getAdminUser();

  const pgn = ((formData.get("pgn") as string) || "").trim();
  const initialPly = parsePly(formData, "initialPly");
  const displayPly = parsePly(formData, "displayPly");
  const endPly = parsePly(formData, "endPly");

  const resolved = resolveFromPlySelection({ pgn, initialPly, displayPly, endPly });
  if ("code" in resolved) {
    return { error: resolved.message };
  }

  const meta = parsePuzzleMetadataFromForm(formData);
  if (!meta.ok) {
    return { error: meta.error };
  }

  const result = await persistNewPuzzle(supabase, {
    title: meta.data.title,
    rating: meta.data.rating,
    popularity: meta.data.popularity,
    gameId: meta.data.gameId,
    sourceId: meta.data.sourceId,
    source: meta.data.source,
    pgn: resolved.pgn,
    moves: resolved.moves,
    initialFen: resolved.initialFen,
    displayFen: resolved.displayFen,
    goals:
      meta.data.goals ?? buildStubGoalsFromMoves(resolved.initialFen, resolved.moves),
    isActive: meta.data.isActive,
    themeSlugs: meta.data.themes,
    studyId: meta.data.studyId,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/admin/puzzles");
  revalidatePath("/studies");
  redirect(`/admin/puzzles/${result.puzzleId}`);
}
