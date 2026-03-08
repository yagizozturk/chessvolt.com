"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  createGameRiddle,
  updateGameRiddle,
  deleteGameRiddle,
} from "@/lib/services/game-riddle";
import type { CreateGameRiddleInput } from "@/lib/repositories/game-riddle.repository";

export async function createGameRiddleAction(formData: FormData) {
  const { supabase, user } = await getAdminUser();

  const gameId = formData.get("gameId") as string;
  const ply = parseInt(formData.get("ply") as string, 10);
  const title = formData.get("title") as string;
  const fen = (formData.get("fen") as string) || null;
  const moves = (formData.get("moves") as string) || null;
  const gameType = (formData.get("gameType") as string) || null;

  if (!gameId || !title || isNaN(ply)) {
    redirect("/admin/game-riddles/new?error=eksik_alan");
  }

  const input: CreateGameRiddleInput = {
    gameId,
    ply,
    title,
    fen: fen || null,
    moves: moves || null,
    gameType: gameType || null,
  };

  const riddle = await createGameRiddle(supabase, input, user.id);
  if (!riddle) {
    redirect("/admin/game-riddles/new?error=olusturulamadi");
  }

  revalidatePath("/admin/game-riddles");
  redirect(`/admin/game-riddles/${riddle.id}`);
}

export async function updateGameRiddleAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const gameId = formData.get("gameId") as string;
  const ply = formData.get("ply");
  const title = formData.get("title") as string;
  const fen = (formData.get("fen") as string) || null;
  const moves = (formData.get("moves") as string) || null;
  const gameType = (formData.get("gameType") as string) || null;

  const input: Record<string, unknown> = {};
  if (gameId) input.gameId = gameId;
  if (ply !== undefined) input.ply = parseInt(ply as string, 10);
  if (title) input.title = title;
  if (fen !== undefined) input.fen = fen;
  if (moves !== undefined) input.moves = moves;
  if (gameType !== undefined) input.gameType = gameType;

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
    redirect("/admin/game-riddles?error=silinemedi");
  }

  revalidatePath("/admin/game-riddles");
  redirect("/admin/game-riddles");
}
