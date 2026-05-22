"use server";

import type {
  CreateRiddleInput,
  UpdateRiddleInput,
} from "@/features/riddle/repository/riddle.repository";
import {
  createRiddle,
  deleteRiddle,
  updateRiddle,
} from "@/features/riddle/services/riddle.service";
import * as gameRepo from "@/features/game/repository/game.repository";
import { parseGoalsFromForm } from "@/lib/admin/parse-goals-from-form";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { getAdminUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseThemesFromForm(formData: FormData): string[] {
  const raw = (formData.get("themes") as string | null)?.trim() ?? "";
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function parseIsActiveFromForm(formData: FormData): boolean {
  return formData.get("isActive") === "on";
}

export async function createRiddleAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = ((formData.get("gameId") as string) || "").trim() || null;
  const pgnInput = ((formData.get("pgn") as string) || "").trim();
  const title = (formData.get("title") as string)?.trim();
  const moves = ((formData.get("moves") as string) || "").trim() || null;
  const gameType = (formData.get("gameType") as string)?.trim() || null;
  const initialFen = ((formData.get("initialFen") as string) || "").trim() || null;
  const displayFen = ((formData.get("displayFen") as string) || "").trim() || null;
  const moveCountForAnswer = parseInt(formData.get("moveCountForAnswer") as string, 10);
  const goals = parseGoalsFromForm(formData, "/admin/riddles/new?error=invalid_goals_json");
  const themes = parseThemesFromForm(formData);
  const isActive = parseIsActiveFromForm(formData);

  if (!title || !gameType) {
    redirect("/admin/riddles/new?error=missing_fields");
  }

  let pgn = pgnInput;
  if (!pgn && gameId) {
    const game = await gameRepo.findById(supabase, gameId);
    pgn = game?.pgn?.trim() ?? "";
  }

  if (!pgn) {
    redirect("/admin/riddles/new?error=missing_pgn");
  }

  const displayPlyRaw = parseInt(formData.get("displayPly") as string, 10);
  const displayPly = !isNaN(displayPlyRaw) && displayPlyRaw >= 0
    ? displayPlyRaw
    : displayFen != null
      ? (getPlyFromPgnAtFen(pgn, displayFen) ?? 0)
      : 0;
  const resolvedDisplayFen =
    displayFen ?? getFenFromPgnAtPly(pgn, displayPly) ?? null;
  const resolvedInitialFen =
    initialFen ?? resolvedDisplayFen ?? undefined;

  let resolvedMoves = moves;
  if (
    !resolvedMoves &&
    resolvedDisplayFen != null &&
    !isNaN(moveCountForAnswer) &&
    moveCountForAnswer >= 1
  ) {
    resolvedMoves =
      getUciMovesFromPgnAfterPlyAtMoveCount(pgn, displayPly, moveCountForAnswer) ?? null;
  }

  if (!resolvedMoves?.trim()) {
    redirect("/admin/riddles/new?error=invalid_pgn");
  }

  const input: CreateRiddleInput = {
    gameId,
    title,
    pgn,
    moves: resolvedMoves,
    gameType,
    initialFen: resolvedInitialFen ?? null,
    displayFen: resolvedDisplayFen,
    goals,
    themes,
    isActive,
  };

  const riddle = await createRiddle(supabase, input);
  if (!riddle) {
    redirect("/admin/riddles/new?error=create_failed");
  }

  revalidatePath("/admin/riddles");
  redirect(`/admin/riddles/${riddle.id}`);
}

export async function updateRiddleAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = ((formData.get("gameId") as string) || "").trim() || null;
  const pgnInput = ((formData.get("pgn") as string) || "").trim();
  const ply = parseInt(formData.get("ply") as string, 10);
  const moveCountForAnswer = parseInt(formData.get("moveCountForAnswer") as string, 10);
  const title = formData.get("title") as string;
  const movesFromForm = ((formData.get("moves") as string) || "").trim() || null;
  const initialFen = ((formData.get("initialFen") as string) || "").trim() || null;
  const displayFenInput = ((formData.get("displayFen") as string) || "").trim() || null;
  const gameType = (formData.get("gameType") as string)?.trim() || null;
  const goals = parseGoalsFromForm(formData, `/admin/riddles/${id}?error=invalid_goals_json`);
  const themes = parseThemesFromForm(formData);
  const isActive = parseIsActiveFromForm(formData);

  if (
    !title?.trim() ||
    !gameType ||
    isNaN(ply) ||
    ply < 0 ||
    isNaN(moveCountForAnswer) ||
    moveCountForAnswer < 1
  ) {
    redirect(`/admin/riddles/${id}?error=missing_fields`);
  }

  let pgn = pgnInput;
  if (!pgn && gameId) {
    const game = await gameRepo.findById(supabase, gameId);
    pgn = game?.pgn?.trim() ?? "";
  }

  const displayFen =
    displayFenInput ?? (pgn ? getFenFromPgnAtPly(pgn, ply) : null);
  const moves =
    movesFromForm ??
    (pgn ? getUciMovesFromPgnAfterPlyAtMoveCount(pgn, ply, moveCountForAnswer) : null);

  if (!moves?.trim()) {
    redirect(`/admin/riddles/${id}?error=invalid_pgn`);
  }

  const input: UpdateRiddleInput = {
    gameId,
    title,
    pgn: pgn || null,
    gameType,
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

export async function deleteRiddleAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteRiddle(supabase, id);
  if (!ok) {
    redirect("/admin/riddles?error=delete_failed");
  }

  revalidatePath("/admin/riddles");
  redirect("/admin/riddles");
}
