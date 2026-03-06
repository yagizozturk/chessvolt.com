/**
 * User Game Riddle Repository
 *
 * Responsibility: CRUD access to the user_game_riddles table.
 * Manages user game riddle attempts (correct/incorrect).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { AttemptedGameRiddle } from "@/lib/model/user-game-riddle";

/** Returns game riddle attempts with correct/incorrect status */
export async function findAttemptedGameRiddleAttempts(
  supabase: SupabaseClient,
  userId: string
): Promise<AttemptedGameRiddle[]> {
  const { data, error } = await supabase
    .from("user_game_riddles")
    .select("game_riddle_id, is_correct")
    .eq("user_id", userId);

  if (error) {
    console.error(
      "user-game-riddle.repository.findAttemptedGameRiddleAttempts error:",
      error
    );
    return [];
  }

  return (
    data?.map((r) => ({
      gameRiddleId: r.game_riddle_id,
      isCorrect: r.is_correct,
    })) ?? []
  );
}

/** Saves or updates game riddle attempt (upsert) */
export async function upsert(
  supabase: SupabaseClient,
  userId: string,
  gameRiddleId: string,
  isCorrect: boolean,
  options?: { userMoveSan?: string | null; timeSpentSeconds?: number | null }
): Promise<void> {
  const { error } = await supabase.from("user_game_riddles").upsert(
    {
      user_id: userId,
      game_riddle_id: gameRiddleId,
      is_correct: isCorrect,
      user_move_san: options?.userMoveSan ?? null,
      time_spent_seconds: options?.timeSpentSeconds ?? null,
    },
    {
      onConflict: "user_id,game_riddle_id",
    }
  );

  if (error) {
    console.error("user-game-riddle.repository.upsert error:", error);
    throw new Error(`Failed to update game riddle attempt: ${error.message}`);
  }
}
