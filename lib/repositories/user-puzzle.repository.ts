/**
 * User Puzzle Repository
 *
 * Responsibility: CRUD access to the user_puzzles table.
 * Manages user puzzle attempts (correct/incorrect).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type AttemptedPuzzle = {
  puzzleId: string;
  isCorrect: boolean;
};

/** Returns puzzle attempts with correct/incorrect status */
export async function findAttemptedPuzzleAttempts(
  supabase: SupabaseClient,
  userId: string
): Promise<AttemptedPuzzle[]> {
  const { data, error } = await supabase
    .from("user_puzzles")
    .select("puzzle_id, is_correct")
    .eq("user_id", userId);

  if (error) {
    console.error(
      "user-puzzle.repository.findAttemptedPuzzleAttempts error:",
      error
    );
    return [];
  }

  return (
    data?.map((r) => ({
      puzzleId: r.puzzle_id,
      isCorrect: r.is_correct,
    })) ?? []
  );
}

/** Returns puzzle IDs that the user solved incorrectly */
export async function findIncorrectPuzzleIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_puzzles")
    .select("puzzle_id")
    .eq("user_id", userId)
    .eq("is_correct", false);

  if (error) {
    console.error("user-puzzle.repository.findIncorrectPuzzleIds error:", error);
    return [];
  }

  return data?.map((r) => r.puzzle_id) ?? [];
}

/** Saves or updates puzzle answer (upsert) */
export async function upsert(
  supabase: SupabaseClient,
  userId: string,
  puzzleId: string,
  isCorrect: boolean
): Promise<void> {
  const now = new Date().toISOString();

  const { error } = await supabase.from("user_puzzles").upsert(
    {
      user_id: userId,
      puzzle_id: puzzleId,
      is_correct: isCorrect,
      updated_at: now,
      created_at: now,
    },
    {
      onConflict: "user_id,puzzle_id",
    }
  );

  if (error) {
    console.error("user-puzzle.repository.upsert error:", error);
    throw new Error(`Failed to update puzzle answer: ${error.message}`);
  }
}
