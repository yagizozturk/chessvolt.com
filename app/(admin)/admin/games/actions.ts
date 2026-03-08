"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  createGame,
  updateGame,
  deleteGame,
} from "@/lib/services/game";
import type { CreateGameInput } from "@/lib/repositories/game.repository";

export async function createGameAction(formData: FormData) {
  const { supabase, user } = await getAdminUser();

  const whitePlayer = formData.get("whitePlayer") as string;
  const blackPlayer = formData.get("blackPlayer") as string;
  const pgn = formData.get("pgn") as string;
  const result = formData.get("result") as string;
  const playedAt = formData.get("playedAt") as string;
  const url = (formData.get("url") as string) || null;
  const event = (formData.get("event") as string) || null;
  const opening = (formData.get("opening") as string) || null;

  if (!whitePlayer || !blackPlayer || !pgn || !result || !playedAt) {
    redirect("/admin/games/new?error=eksik_alan");
  }

  const input: CreateGameInput = {
    whitePlayer,
    blackPlayer,
    pgn,
    result,
    playedAt,
    url: url || null,
    event: event || null,
    opening: opening || null,
  };

  const game = await createGame(supabase, input, user.id);
  if (!game) {
    redirect("/admin/games/new?error=olusturulamadi");
  }

  revalidatePath("/admin/games");
  redirect(`/admin/games/${game.id}`);
}

export async function updateGameAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const whitePlayer = formData.get("whitePlayer") as string;
  const blackPlayer = formData.get("blackPlayer") as string;
  const pgn = formData.get("pgn") as string;
  const result = formData.get("result") as string;
  const playedAt = formData.get("playedAt") as string;
  const url = (formData.get("url") as string) || null;
  const event = (formData.get("event") as string) || null;
  const opening = (formData.get("opening") as string) || null;

  const input: Record<string, unknown> = {};
  if (whitePlayer) input.whitePlayer = whitePlayer;
  if (blackPlayer) input.blackPlayer = blackPlayer;
  if (pgn) input.pgn = pgn;
  if (result) input.result = result;
  if (playedAt) input.playedAt = playedAt;
  if (url !== undefined) input.url = url;
  if (event !== undefined) input.event = event;
  if (opening !== undefined) input.opening = opening;

  const game = await updateGame(supabase, id, input);
  if (!game) {
    redirect(`/admin/games/${id}?error=guncellenemedi`);
  }

  revalidatePath("/admin/games");
  revalidatePath(`/admin/games/${id}`);
  redirect(`/admin/games/${id}`);
}

export async function deleteGameAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteGame(supabase, id);
  if (!ok) {
    redirect("/admin/games?error=silinemedi");
  }

  revalidatePath("/admin/games");
  redirect("/admin/games");
}
