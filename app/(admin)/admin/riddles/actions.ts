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
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { isMoveGoalsArray } from "@/features/move-sequence/validation/move-sequence-goals";
import { getAdminUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type BulkRiddleInput = {
  title?: string;
  game_type?: string;
  game_id?: string | null;
  pgn?: string;
  initial_ply?: number;
  display_ply?: number;
  move_count_for_answer?: number;
  answer_end_ply?: number;
  moves?: string | null;
  themes?: string[] | string | null;
  is_active?: boolean;
  goals?: unknown;
};

function parseBulkThemes(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) {
    return v.filter((t): t is string => typeof t === "string").map((t) => t.trim()).filter(Boolean);
  }
  if (typeof v === "string") {
    return v
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

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

export async function bulkCreateRiddlesAction(jsonData: string) {
  const { supabase } = await getAdminUser();

  let items: BulkRiddleInput | BulkRiddleInput[];
  try {
    const parsed = JSON.parse(jsonData.trim()) as unknown;
    items = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    redirect("/admin/riddles/bulk?error=invalid_json");
  }

  const created: string[] = [];
  const errors: { index: number; message: string }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const title = item?.title?.trim();
    const gameType = item?.game_type?.trim();
    const gameId = item?.game_id?.trim() || null;

    if (!title || !gameType) {
      errors.push({ index: i, message: "title and game_type are required" });
      continue;
    }

    let pgn = item?.pgn?.trim() ?? "";
    if (!pgn && gameId) {
      const game = await gameRepo.findById(supabase, gameId);
      pgn = game?.pgn?.trim() ?? "";
    }

    if (!pgn) {
      errors.push({ index: i, message: "pgn is required (or provide game_id with a saved PGN)" });
      continue;
    }

    const displayPly = Math.max(0, item.display_ply ?? item.initial_ply ?? 0);
    const initialPly = Math.max(0, item.initial_ply ?? displayPly);

    const displayFen = getFenFromPgnAtPly(pgn, displayPly);
    if (!displayFen) {
      errors.push({
        index: i,
        message: `display_ply (${displayPly}) exceeds PGN length`,
      });
      continue;
    }

    const initialFen = getFenFromPgnAtPly(pgn, initialPly);
    if (!initialFen) {
      errors.push({
        index: i,
        message: `initial_ply (${initialPly}) exceeds PGN length`,
      });
      continue;
    }

    let moves = item.moves?.trim() || null;
    if (!moves) {
      let moveCount = item.move_count_for_answer;
      if (item.answer_end_ply != null && !Number.isNaN(item.answer_end_ply)) {
        moveCount = Math.max(1, item.answer_end_ply - displayPly);
      }
      if (moveCount == null || moveCount < 1) {
        errors.push({
          index: i,
          message: "moves or move_count_for_answer (or answer_end_ply) is required",
        });
        continue;
      }
      moves = getUciMovesFromPgnAfterPlyAtMoveCount(pgn, displayPly, moveCount) ?? null;
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
          message:
            "goals must be null or an array of { ply, move, title, description, isCompleted, card? }",
        });
        continue;
      }
    }

    const input: CreateRiddleInput = {
      gameId,
      title,
      pgn,
      moves,
      gameType,
      initialFen,
      displayFen,
      themes: parseBulkThemes(item.themes),
      isActive: item.is_active ?? true,
      ...(goals !== undefined ? { goals } : {}),
    };

    const riddle = await createRiddle(supabase, input);
    if (riddle) {
      created.push(riddle.id);
    } else {
      errors.push({ index: i, message: "Could not be written to the database" });
    }
  }

  const params = new URLSearchParams();
  if (created.length > 0) params.set("created", created.length.toString());
  if (errors.length > 0) params.set("errors", errors.length.toString());
  if (errors.length > 0) params.set("errorDetails", JSON.stringify(errors));

  revalidatePath("/admin/riddles");
  redirect(`/admin/riddles/bulk?${params.toString()}`);
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
