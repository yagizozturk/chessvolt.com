"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import { createGame } from "@/features/game/services/game";
import { parsePgn, splitPgnGames, validatePgn } from "@/lib/chess/parsePgn";

export async function importPgnAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const pgnText = formData.get("pgn") as string;
  if (!pgnText?.trim()) {
    redirect("/admin/games/import?error=eksik_pgn");
  }

  const games = splitPgnGames(pgnText);
  if (games.length === 0) {
    redirect("/admin/games/import?error=gecersiz_pgn");
  }

  const inserted: string[] = [];
  const errors: string[] = [];

  for (const gamePgn of games) {
    if (!validatePgn(gamePgn)) {
      errors.push("Invalid move: " + gamePgn.slice(0, 50) + "...");
      continue;
    }

    const parsed = parsePgn(gamePgn);
    if (!parsed) {
      errors.push("Parse error");
      continue;
    }

    const game = await createGame(supabase, {
      whitePlayer: parsed.whitePlayer,
      blackPlayer: parsed.blackPlayer,
      pgn: parsed.pgn,
      result: parsed.result,
      playedAt: parsed.playedAt,
      url: parsed.url,
      event: parsed.event,
      opening: parsed.opening,
      description: parsed.description,
    });

    if (game) {
      inserted.push(game.id);
    } else {
      errors.push(
        `${parsed.whitePlayer} vs ${parsed.blackPlayer} could not be added`,
      );
    }
  }

  revalidatePath("/admin/games");

  if (inserted.length > 0) {
    const query =
      errors.length > 0
        ? `?imported=${inserted.length}&errors=${errors.length}`
        : `?imported=${inserted.length}`;
    redirect(`/admin/games${query}`);
  }

  redirect("/admin/games/import?error=hic_eklenemedi");
}
