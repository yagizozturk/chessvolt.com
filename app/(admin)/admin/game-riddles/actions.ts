"use server";

import type {
  CreateGameRiddleInput,
  UpdateGameRiddleInput,
} from "@/features/game-riddle/repository/game-riddle.repository";
import {
  createGameRiddle,
  deleteGameRiddle,
  updateGameRiddle,
} from "@/features/game-riddle/services/game-riddle.service";
import * as gameRepo from "@/features/game/repository/game.repository";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { isMoveGoalsArray } from "@/features/move-sequence/validation/move-sequence-goals";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
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

function parseGoalsFromForm(formData: FormData, errorRedirect: string): MoveGoal[] | null {
  const raw = formData.get("goals");
  if (raw === null) return null;
  const str = typeof raw === "string" ? raw.trim() : "";
  if (str === "") return null;
  try {
    const parsed = JSON.parse(str) as unknown;
    if (parsed === null) return null;
    if (!isMoveGoalsArray(parsed)) redirect(errorRedirect);
    return parsed;
  } catch {
    redirect(errorRedirect);
  }
}

export async function createGameRiddleAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = formData.get("gameId") as string;
  const ply = parseInt(formData.get("ply") as string, 10);
  const title = formData.get("title") as string;
  const moves = (formData.get("moves") as string) || null;
  const gameType = (formData.get("gameType") as string)?.trim() || null;
  const goals = parseGoalsFromForm(formData, "/admin/game-riddles/new?error=invalid_goals_json");
  const themes = parseThemesFromForm(formData);
  const isActive = parseIsActiveFromForm(formData);

  if (!gameId || !title || !gameType || isNaN(ply) || ply < 0) {
    redirect("/admin/game-riddles/new?error=missing_fields");
  }

  const game = await gameRepo.findById(supabase, gameId);
  const displayFen = game?.pgn != null ? getFenFromPgnAtPly(game.pgn, ply) : null;

  const input: CreateGameRiddleInput = {
    gameId,
    title,
    moves: moves || null,
    gameType,
    displayFen,
    goals,
    themes,
    isActive,
  };

  const riddle = await createGameRiddle(supabase, input);
  if (!riddle) {
    redirect("/admin/game-riddles/new?error=create_failed");
  }

  revalidatePath("/admin/game-riddles");
  redirect(`/admin/game-riddles/${riddle.id}`);
}

export async function updateGameRiddleAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = formData.get("gameId") as string;
  const ply = parseInt(formData.get("ply") as string, 10);
  const moveCountForAnswer = parseInt(formData.get("moveCountForAnswer") as string, 10);
  const title = formData.get("title") as string;
  const gameType = (formData.get("gameType") as string)?.trim() || null;
  const goals = parseGoalsFromForm(formData, `/admin/game-riddles/${id}?error=invalid_goals_json`);
  const themes = parseThemesFromForm(formData);
  const isActive = parseIsActiveFromForm(formData);

  if (
    !gameId ||
    !title?.trim() ||
    !gameType ||
    isNaN(ply) ||
    ply < 0 ||
    isNaN(moveCountForAnswer) ||
    moveCountForAnswer < 1
  ) {
    redirect(`/admin/game-riddles/${id}?error=missing_fields`);
  }

  const game = await gameRepo.findById(supabase, gameId);
  const displayFen = game?.pgn != null ? getFenFromPgnAtPly(game.pgn, ply) : null;
  const moves =
    game?.pgn != null
      ? (getUciMovesFromPgnAfterPlyAtMoveCount(game.pgn, ply, moveCountForAnswer) ?? null)
      : null;

  const input: UpdateGameRiddleInput = {
    gameId,
    title,
    gameType,
    displayFen,
    moves,
    goals,
    themes,
    isActive,
  };

  const riddle = await updateGameRiddle(supabase, id, input);
  if (!riddle) {
    redirect(`/admin/game-riddles/${id}?error=update_failed`);
  }

  revalidatePath("/admin/game-riddles");
  revalidatePath(`/admin/game-riddles/${id}`);
  redirect(`/admin/game-riddles/${id}`);
}

export async function deleteGameRiddleAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteGameRiddle(supabase, id);
  if (!ok) {
    redirect("/admin/game-riddles?error=delete_failed");
  }

  revalidatePath("/admin/game-riddles");
  redirect("/admin/game-riddles");
}
