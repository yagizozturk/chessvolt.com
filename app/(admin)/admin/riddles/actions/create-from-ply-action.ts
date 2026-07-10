"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseRiddleMetadataFromForm } from "@/app/(admin)/admin/riddles/lib/parse-riddle-metadata";
import { persistNewRiddle } from "@/app/(admin)/admin/riddles/lib/persist-riddle";
import { resolveFromPlySelection } from "@/app/(admin)/admin/riddles/lib/resolve-riddle-sequence";
import type { RiddleFormState } from "@/app/(admin)/admin/riddles/lib/riddle-form-state";
import { buildStubGoalsFromMoves } from "@/lib/move-sequence-goals/build-stub-goals";
import { getAdminUser } from "@/lib/supabase/auth";

function parsePly(formData: FormData, key: string): number {
  const value = parseInt(String(formData.get(key) ?? ""), 10);
  return Number.isFinite(value) ? value : -1;
}

export async function createFromPlyAction(_prevState: RiddleFormState, formData: FormData): Promise<RiddleFormState> {
  const { supabase } = await getAdminUser();

  const pgn = ((formData.get("pgn") as string) || "").trim();
  const initialPly = parsePly(formData, "initialPly");
  const displayPly = parsePly(formData, "displayPly");
  const endPly = parsePly(formData, "endPly");

  const resolved = resolveFromPlySelection({ pgn, initialPly, displayPly, endPly });
  if ("code" in resolved) {
    return { error: resolved.message };
  }

  const meta = parseRiddleMetadataFromForm(formData);
  if (!meta.ok) {
    return { error: meta.error };
  }

  const result = await persistNewRiddle(supabase, {
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
    collectionId: meta.data.collectionId,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/admin/riddles");
  revalidatePath("/collection");
  redirect(`/admin/riddles/${result.riddleId}`);
}
