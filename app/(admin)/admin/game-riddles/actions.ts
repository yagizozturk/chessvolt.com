"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  createGameRiddle,
  updateGameRiddle,
  deleteGameRiddle,
} from "@/features/game-riddle/services/game-riddle";
import * as gameRepo from "@/features/game/repository/game.repository";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import type { CreateGameRiddleInput } from "@/features/game-riddle/repository/game-riddle.repository";

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
  const title = formData.get("title") as string;
  const moves = (formData.get("moves") as string) || null;
  const gameType = (formData.get("gameType") as string)?.trim() || null;
  const displayFenForm = (formData.get("displayFen") as string)?.trim() || null;

  const input: Record<string, unknown> = {};
  if (gameId) input.gameId = gameId;
  if (title) input.title = title;
  if (moves !== undefined) input.moves = moves;
  if (gameType !== undefined) {
    if (!gameType) {
      redirect(`/admin/game-riddles/${id}?error=eksik_alan`);
    }
    input.gameType = gameType;
  }
  input.displayFen = displayFenForm;

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
