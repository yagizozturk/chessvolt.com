"use server";

import { revalidatePath } from "next/cache";

import { buildSourceIdFromPgn } from "@/app/(admin)/admin/puzzles/lib/build-source-id-from-pgn";
import { persistNewPuzzle } from "@/app/(admin)/admin/puzzles/lib/persist-puzzle";
import { resolveFromPgnDefaultPlies } from "@/app/(admin)/admin/puzzles/lib/resolve-puzzle-sequence";
import type { BulkCreateFormState } from "@/app/(admin)/admin/puzzles/lib/puzzle-form-state";
import { splitPgnGames } from "@/lib/chess/parsePgn";
import { buildStubGoalsFromMoves } from "@/lib/move-sequence-goals/build-stub-goals";
import { getAdminUser } from "@/lib/supabase/auth";

export async function bulkCreateAction(
  _prevState: BulkCreateFormState,
  formData: FormData,
): Promise<BulkCreateFormState> {
  const { supabase } = await getAdminUser();

  const source = ((formData.get("source") as string) || "").trim() || null;
  const defaultStudyId = ((formData.get("studyId") as string) || "").trim() || null;
  const pgnText = ((formData.get("pgnText") as string) || "").trim();

  if (!pgnText) {
    return { error: "Paste one or more PGNs to import." };
  }

  const pgns = splitPgnGames(pgnText);
  if (pgns.length === 0) {
    return { error: "Could not find any PGN games. Separate games with a blank line before each [Event] tag." };
  }

  const errors: string[] = [];
  let created = 0;

  for (let i = 0; i < pgns.length; i++) {
    const pgn = pgns[i]!;
    const resolved = resolveFromPgnDefaultPlies(pgn);
    if ("code" in resolved) {
      errors.push(`PGN ${i + 1}: ${resolved.message}`);
      continue;
    }

    const result = await persistNewPuzzle(supabase, {
      title: `Puzzle ${i + 1}`,
      rating: null,
      source,
      sourceId: buildSourceIdFromPgn(pgn),
      pgn: resolved.pgn,
      moves: resolved.moves,
      initialFen: resolved.initialFen,
      displayFen: resolved.displayFen,
      goals: buildStubGoalsFromMoves(resolved.initialFen, resolved.moves),
      isActive: true,
      studyId: defaultStudyId,
    });

    if (!result.ok) {
      errors.push(`PGN ${i + 1}: ${result.error}`);
      continue;
    }

    created++;
  }

  revalidatePath("/admin/puzzles");
  revalidatePath("/studies");

  return {
    error: null,
    summary: {
      created,
      failed: pgns.length - created,
      errors: errors.slice(0, 50),
    },
  };
}
