import type { SupabaseClient } from "@supabase/supabase-js";

import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import { getFavoritedGameAnalysisMistakeIds } from "@/features/user-favorites/services/user-favorite.service";

// ================================================================================================
// Favorilenmiş hataların idsini getirir. Volt tracker da gözükürler ve o hatadan başlar.
// ================================================================================================
export async function getFavoritedMistakeIds(
  supabase: SupabaseClient,
  userId: string,
  mistakes: GameAnalysisMistake[],
): Promise<string[]> {
  if (mistakes.length === 0) return [];

  const ids = await getFavoritedGameAnalysisMistakeIds(
    supabase,
    userId,
    mistakes.map((mistake) => mistake.id),
  );
  return [...ids];
}
