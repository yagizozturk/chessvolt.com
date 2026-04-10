"use server";

import { createGameRiddle } from "@/features/game-riddle/services/game-riddle.service";
import { createGame } from "@/features/game/services/game.service";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { parsePgn, splitPgnGames } from "@/lib/chess/parsePgn";
import { getAdminUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DEFAULT_GAME_TYPE = "legend_games";

export async function importPgnAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const pgnText = formData.get("pgn") as string;
  if (!pgnText?.trim()) {
    redirect("/admin/games/import?error=missing_pgn");
  }

  const gameType =
    (formData.get("gameType") as string)?.trim() || DEFAULT_GAME_TYPE;

  const games = splitPgnGames(pgnText);
  if (games.length === 0) {
    redirect("/admin/games/import?error=invalid_pgn");
  }

  const inserted: string[] = [];
  const errors: string[] = [];

  for (const gamePgn of games) {
    const parsed = parsePgn(gamePgn);
    if (!parsed) {
      errors.push(
        "Could not parse or validate PGN: " + gamePgn.slice(0, 50) + "...",
      );
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

      // Default game_riddle at ply 0: title from ChapterName (description)
      const movesAtPly0 = getUciMovesFromPgnAfterPlyAtMoveCount(
        parsed.pgn,
        0,
        1,
      );
      const defaultTitle =
        parsed.description?.trim() ||
        `Find the first move - ${parsed.whitePlayer} vs ${parsed.blackPlayer}`;
      const displayFen = getFenFromPgnAtPly(parsed.pgn, 0);

      await createGameRiddle(supabase, {
        gameId: game.id,
        title: defaultTitle,
        moves: movesAtPly0 ?? "",
        gameType,
        displayFen,
      });
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

  redirect("/admin/games/import?error=none_added");
}
