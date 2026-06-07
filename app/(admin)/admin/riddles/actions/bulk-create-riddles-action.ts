"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { isMoveGoalsArray } from "@/features/move-sequence/validation/move-sequence-goals";
import type { CreateRiddleInput } from "@/features/riddle/repository/riddle.repository";
import { createRiddle } from "@/features/riddle/services/riddle.service";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getAdminUser } from "@/lib/supabase/auth";

import {
  linkRiddleToCollection,
  normalizeBulkRiddleInputs,
  parseBulkCollectionId,
  parseBulkRating,
  parseBulkThemes,
  resolvePgnFromFormInput,
  syncRiddleThemesFromSlugs,
} from "./action-utils";

export async function bulkCreateRiddlesAction(jsonData: string, returnPath = "/admin/riddles/bulk") {
  const { supabase } = await getAdminUser();

  let items = [];
  try {
    const parsed = JSON.parse(jsonData.trim()) as unknown;
    items = normalizeBulkRiddleInputs(parsed);
  } catch {
    redirect(`${returnPath}?error=invalid_json`);
  }

  const created: string[] = [];
  const errors: { index: number; message: string }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const title = item?.title?.trim();
    const gameId = item?.gameId?.trim() || null;
    const collectionId = parseBulkCollectionId(item?.collectionId);

    if (!title) {
      errors.push({ index: i, message: "title is required" });
      continue;
    }

    if (!collectionId) {
      errors.push({ index: i, message: "collectionId is required" });
      continue;
    }

    const pgn = await resolvePgnFromFormInput({
      supabase,
      pgnInput: item?.pgn?.trim() ?? "",
      gameId,
    });

    if (!pgn) {
      errors.push({ index: i, message: "pgn is required (or provide gameId with a saved PGN)" });
      continue;
    }

    const initialPly = Math.max(0, item.initialPly ?? 0);
    const displayPly = Math.max(0, item.displayPly ?? initialPly);

    const displayFen = getFenFromPgnAtPly(pgn, displayPly);
    if (!displayFen) {
      errors.push({
        index: i,
          message: `displayPly (${displayPly}) exceeds PGN length`,
      });
      continue;
    }

    const initialFen = getFenFromPgnAtPly(pgn, initialPly);
    if (!initialFen) {
      errors.push({
        index: i,
          message: `initialPly (${initialPly}) exceeds PGN length`,
      });
      continue;
    }

    const moves = item.moves?.trim() || null;

    if (!moves) {
      errors.push({
        index: i,
        message: "moves is required and must be a non-empty string",
      });
      continue;
    }

    if (!moves?.trim()) {
      errors.push({ index: i, message: "Invalid PGN or could not derive moves" });
      continue;
    }

    let goals: MoveGoal[] | null | undefined;
    if ("goals" in (item ?? {})) {
      const g = item.goals;
      if (g === null) {
        goals = null;
      } else if (isMoveGoalsArray(g)) {
        goals = g;
      } else {
        errors.push({
          index: i,
          message: "goals must be null or an array of { ply, move, title, description, isCompleted, card? }",
        });
        continue;
      }
    }

    const description = item.description?.trim() || null;
    const themeSlugs = parseBulkThemes(item.themes);

    const input: CreateRiddleInput = {
      gameId,
      sourceId: item.sourceId?.trim() || null,
      source: item.source?.trim() || null,
      title,
      description,
      rating: parseBulkRating(item.rating),
      pgn,
      moves,
      initialFen,
      displayFen,
      isActive: item.isActive ?? true,
      ...(goals !== undefined ? { goals } : {}),
    };

    const riddle = await createRiddle(supabase, input);
    if (riddle) {
      const themesSynced = await syncRiddleThemesFromSlugs(supabase, riddle.id, themeSlugs);
      if (!themesSynced) {
        errors.push({ index: i, message: "Riddle created but content themes could not be synced" });
        continue;
      }

      const linked = await linkRiddleToCollection(supabase, riddle.id, collectionId);
      if (linked) {
        created.push(riddle.id);
      } else {
        errors.push({ index: i, message: "Riddle created but could not be linked to collection" });
      }
    } else {
      errors.push({ index: i, message: "Could not be written to the database" });
    }
  }

  const params = new URLSearchParams();
  if (created.length > 0) params.set("created", created.length.toString());
  if (errors.length > 0) params.set("errors", errors.length.toString());
  if (errors.length > 0) params.set("errorDetails", JSON.stringify(errors));

  revalidatePath("/admin/riddles");
  revalidatePath("/collection");
  redirect(`${returnPath}?${params.toString()}`);
}

export async function bulkCreateRiddlesFormAction(formData: FormData) {
  const jsonData = ((formData.get("jsonData") as string) || "").trim();
  await bulkCreateRiddlesAction(jsonData, "/admin/riddles/bulk");
}
