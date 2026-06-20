import type { SupabaseClient } from "@supabase/supabase-js";

import { getGamesByIds } from "@/features/game/services/game.service";
import type { Game } from "@/features/game/types/game";
import type { RiddlesListFilters } from "@/features/riddle/constants/riddles-list.constants";
import { getRandomActiveRiddles } from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";

export type RiddleListItem = {
  riddle: Riddle;
  game: Game | null;
};

export async function getRandomRiddlesForDisplay(
  supabase: SupabaseClient,
  filters: RiddlesListFilters,
): Promise<RiddleListItem[]> {
  const riddles = await getRandomActiveRiddles(supabase, {
    themeSlug: filters.themeSlug,
    ratingBand: filters.ratingBand,
  });

  const gameIds = [...new Set(riddles.map((riddle) => riddle.gameId).filter((id): id is string => id != null))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((game) => [game.id, game]));

  return riddles
    .map((riddle) => {
      const game = riddle.gameId ? (gameMap[riddle.gameId] ?? null) : null;
      if (!game && !riddle.moveSequence.displayFen) return null;
      return { riddle, game };
    })
    .filter((item): item is RiddleListItem => item != null);
}
