"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { UpdateRiddleInput } from "@/features/riddle/repository/riddle.repository";
import { updateRiddle } from "@/features/riddle/services/riddle.service";
import { parseGoalsFromForm } from "@/lib/admin/parse-goals-from-form";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { getAdminUser } from "@/lib/supabase/auth";

import {
  parseDescriptionFromForm,
  parseDifficultyFromForm,
  parseIsActiveFromForm,
  parseThemesFromForm,
  resolvePgnFromFormInput,
} from "./action-utils";

export async function updateRiddleAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = ((formData.get("gameId") as string) || "").trim() || null;
  const pgnInput = ((formData.get("pgn") as string) || "").trim();
  const initialPlyRaw = parseInt(formData.get("initialPly") as string, 10);
  const displayPlyRaw = parseInt(formData.get("displayPly") as string, 10);
  const legacyDisplayPly = parseInt(formData.get("ply") as string, 10);
  const moveCountForAnswer = parseInt(formData.get("moveCountForAnswer") as string, 10);
  const title = formData.get("title") as string;
  const description = parseDescriptionFromForm(formData);
  const difficulty = parseDifficultyFromForm(formData);
  const movesFromForm = ((formData.get("moves") as string) || "").trim() || null;
  const initialFenInput = ((formData.get("initialFen") as string) || "").trim() || null;
  const displayFenInput = ((formData.get("displayFen") as string) || "").trim() || null;
  const goals = parseGoalsFromForm(formData, `/admin/riddles/${id}?error=invalid_goals_json`);
  const themes = parseThemesFromForm(formData);
  const isActive = parseIsActiveFromForm(formData);

  const displayPlyFromForm =
    !isNaN(displayPlyRaw) && displayPlyRaw >= 0
      ? displayPlyRaw
      : !isNaN(legacyDisplayPly) && legacyDisplayPly >= 0
        ? legacyDisplayPly
        : NaN;

  if (
    !title?.trim() ||
    isNaN(displayPlyFromForm) ||
    displayPlyFromForm < 0 ||
    isNaN(moveCountForAnswer) ||
    moveCountForAnswer < 1
  ) {
    redirect(`/admin/riddles/${id}?error=missing_fields`);
  }

  const pgn = await resolvePgnFromFormInput({ supabase, pgnInput, gameId });

  const initialPly =
    !isNaN(initialPlyRaw) && initialPlyRaw >= 0
      ? initialPlyRaw
      : initialFenInput && pgn
        ? (getPlyFromPgnAtFen(pgn, initialFenInput) ?? 0)
        : displayPlyFromForm;
  const displayPly = displayPlyFromForm;
  const initialFen = initialFenInput ?? (pgn ? getFenFromPgnAtPly(pgn, initialPly) : null);
  const displayFen = displayFenInput ?? (pgn ? getFenFromPgnAtPly(pgn, displayPly) : null);
  const moves =
    movesFromForm ?? (pgn ? getUciMovesFromPgnAfterPlyAtMoveCount(pgn, initialPly, moveCountForAnswer) : null);

  if (!moves?.trim()) {
    redirect(`/admin/riddles/${id}?error=invalid_pgn`);
  }

  const input: UpdateRiddleInput = {
    gameId,
    title,
    description,
    difficulty,
    pgn: pgn || null,
    initialFen,
    displayFen,
    moves,
    goals,
    themes,
    isActive,
  };

  const riddle = await updateRiddle(supabase, id, input);
  if (!riddle) {
    redirect(`/admin/riddles/${id}?error=update_failed`);
  }

  revalidatePath("/admin/riddles");
  revalidatePath(`/admin/riddles/${id}`);
  redirect(`/admin/riddles/${id}`);
}
