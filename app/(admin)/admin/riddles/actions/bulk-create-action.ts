"use server";

import { revalidatePath } from "next/cache";

import { buildSourceIdFromPgn } from "@/app/(admin)/admin/riddles/lib/build-source-id-from-pgn";
import { persistNewRiddle } from "@/app/(admin)/admin/riddles/lib/persist-riddle";
import { resolveFromPgnDefaultPlies } from "@/app/(admin)/admin/riddles/lib/resolve-riddle-sequence";
import type { BulkCreateFormState } from "@/app/(admin)/admin/riddles/lib/riddle-form-state";
import { splitPgnGames } from "@/lib/chess/parsePgn";
import { getAdminUser } from "@/lib/supabase/auth";

export async function bulkCreateAction(
  _prevState: BulkCreateFormState,
  formData: FormData,
): Promise<BulkCreateFormState> {
  const { supabase } = await getAdminUser();

  const source = ((formData.get("source") as string) || "").trim() || null;
  const defaultCollectionId = ((formData.get("collectionId") as string) || "").trim() || null;
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

    const result = await persistNewRiddle(supabase, {
      title: `Riddle ${i + 1}`,
      rating: null,
      source,
      sourceId: buildSourceIdFromPgn(pgn),
      pgn: resolved.pgn,
      moves: resolved.moves,
      initialFen: resolved.initialFen,
      displayFen: resolved.displayFen,
      isActive: true,
      collectionId: defaultCollectionId,
    });

    if (!result.ok) {
      errors.push(`PGN ${i + 1}: ${result.error}`);
      continue;
    }

    created++;
  }

  revalidatePath("/admin/riddles");
  revalidatePath("/collection");

  return {
    error: null,
    summary: {
      created,
      failed: pgns.length - created,
      errors: errors.slice(0, 50),
    },
  };
}
