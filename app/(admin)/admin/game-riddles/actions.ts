"use server";

import type { CreateGameRiddleInput } from "@/features/game-riddle/repository/game-riddle.repository";
import {
  createGameRiddle,
  deleteGameRiddle,
  updateGameRiddle,
} from "@/features/game-riddle/services/game-riddle.service";
import * as gameRepo from "@/features/game/repository/game.repository";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { getAdminUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGameRiddleAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = formData.get("gameId") as string;
  const ply = parseInt(formData.get("ply") as string, 10);
  const title = formData.get("title") as string;
  const moves = (formData.get("moves") as string) || null;
  const gameType = (formData.get("gameType") as string)?.trim() || null;

  if (!gameId || !title || !gameType || isNaN(ply) || ply < 0) {
    redirect("/admin/game-riddles/new?error=eksik_alan");
  }

  const game = await gameRepo.findById(supabase, gameId);
  const displayFen =
    game?.pgn != null ? getFenFromPgnAtPly(game.pgn, ply) : null;

  const input: CreateGameRiddleInput = {
    gameId,
    title,
    moves: moves || null,
    gameType,
    displayFen,
  };

  const riddle = await createGameRiddle(supabase, input);
  if (!riddle) {
    redirect("/admin/game-riddles/new?error=olusturulamadi");
  }

  revalidatePath("/admin/game-riddles");
  redirect(`/admin/game-riddles/${riddle.id}`);
}

export async function updateGameRiddleAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = formData.get("gameId") as string;
  const ply = parseInt(formData.get("ply") as string, 10);
  const moveCountForAnswer = parseInt(
    formData.get("moveCountForAnswer") as string,
    10,
  );
  const title = formData.get("title") as string;
  const gameType = (formData.get("gameType") as string)?.trim() || null;

  if (
    !gameId ||
    !title?.trim() ||
    !gameType ||
    isNaN(ply) ||
    ply < 0 ||
    isNaN(moveCountForAnswer) ||
    moveCountForAnswer < 1
  ) {
    redirect(`/admin/game-riddles/${id}?error=eksik_alan`);
  }

  const game = await gameRepo.findById(supabase, gameId);
  const displayFen =
    game?.pgn != null ? getFenFromPgnAtPly(game.pgn, ply) : null;
  const moves =
    game?.pgn != null
      ? (getUciMovesFromPgnAfterPlyAtMoveCount(
          game.pgn,
          ply,
          moveCountForAnswer,
        ) ?? null)
      : null;

  const input: Record<string, unknown> = {
    gameId,
    title,
    gameType,
    displayFen,
    moves,
  };

  const riddle = await updateGameRiddle(supabase, id, input);
  if (!riddle) {
    redirect(`/admin/game-riddles/${id}?error=guncellenemedi`);
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
