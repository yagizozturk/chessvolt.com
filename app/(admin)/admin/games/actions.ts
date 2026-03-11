"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  createGame,
  updateGame,
  deleteGame,
} from "@/features/game-riddle/services/game";
import type { CreateGameInput } from "@/features/game-riddle/repository/game.repository";

export async function createGameAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const whitePlayer = formData.get("whitePlayer") as string;
  const blackPlayer = formData.get("blackPlayer") as string;
  const pgn = formData.get("pgn") as string;
  const result = formData.get("result") as string;
  const playedAt = formData.get("playedAt") as string;
  const url = (formData.get("url") as string) || null;
  const event = (formData.get("event") as string) || null;
  const opening = (formData.get("opening") as string) || null;
  const description = (formData.get("description") as string) || null;

  if (!whitePlayer || !blackPlayer || !pgn || !result || !playedAt) {
    redirect("/admin/games/new?error=eksik_alan");
  }

  // Normalize result for DB constraint (1-0, 0-1, 1/2-1/2)
  const normalizedResult =
    result === "1-0" || result === "0-1" || result === "1/2-1/2"
      ? result
      : "1/2-1/2";

  const input: CreateGameInput = {
    whitePlayer,
    blackPlayer,
    pgn,
    result: normalizedResult,
    playedAt: playedAt.length === 16 ? `${playedAt}:00` : playedAt,
    url: url || null,
    event: event || null,
    opening: opening || null,
    description: description || null,
  };

  const game = await createGame(supabase, input);
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
  const description = (formData.get("description") as string) || null;

  const normalizedResult =
    result === "1-0" || result === "0-1" || result === "1/2-1/2"
      ? result
      : "1/2-1/2";

  const input: Record<string, unknown> = {};
  if (whitePlayer) input.whitePlayer = whitePlayer;
  if (blackPlayer) input.blackPlayer = blackPlayer;
  if (pgn) input.pgn = pgn;
  if (result) input.result = normalizedResult;
  if (playedAt)
    input.playedAt = playedAt.length === 16 ? `${playedAt}:00` : playedAt;
  if (url !== undefined) input.url = url;
  if (event !== undefined) input.event = event;
  if (opening !== undefined) input.opening = opening;
  if (description !== undefined) input.description = description;

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
    redirect("/admin/games?error=delete_failed");
  }

  revalidatePath("/admin/games");
  redirect("/admin/games");
}
