/**
 * Puzzle Service
 *
 * Responsibility: Puzzle business logic and orchestration.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as puzzleThemeService from "@/features/puzzle-theme/services/puzzle-theme.service";
import { RECENT_SOLVED_PUZZLE_COUNT } from "@/features/puzzle/constants/random-puzzle.constants";
import * as puzzleRepo from "@/features/puzzle/repository/puzzle.repository";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import type { PuzzleWithThemes } from "@/features/puzzle/types/puzzle-with-themes";
import type { RandomActivePuzzleOptions } from "@/features/puzzle/types/random-active-puzzle";
import * as userSequenceAttemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export async function getPuzzleById(supabase: SupabaseClient, id: string): Promise<Puzzle | null> {
  return puzzleRepo.findById(supabase, id);
}

export async function getAllActivePuzzles(supabase: SupabaseClient): Promise<Puzzle[]> {
  return puzzleRepo.findAllActive(supabase);
}

// Skips the puzzle on screen and, for a logged-in user, their most recent solved puzzles.
// If that filter matches nothing, the oldest solved id is dropped until a puzzle remains.
export async function getRandomActivePuzzleId(
  supabase: SupabaseClient,
  options?: RandomActivePuzzleOptions,
): Promise<string | null> {
  const excludeSequenceIds = options?.userId
    ? await userSequenceAttemptService.getRecentCompletedSequenceIds(
        supabase,
        options.userId,
        RECENT_SOLVED_PUZZLE_COUNT,
      )
    : [];

  for (let solvedWindow = excludeSequenceIds.length; solvedWindow >= 0; solvedWindow -= 1) {
    const puzzleId = await puzzleRepo.findRandomActiveId(supabase, {
      excludePuzzleId: options?.excludePuzzleId,
      excludeSequenceIds: excludeSequenceIds.slice(0, solvedWindow),
    });
    if (puzzleId) return puzzleId;
  }

  return null;
}

export async function getPuzzleByIdWithThemes(supabase: SupabaseClient, id: string): Promise<PuzzleWithThemes | null> {
  const puzzle = await puzzleRepo.findById(supabase, id);
  if (!puzzle) return null;

  const slugsByPuzzleId = await puzzleThemeService.getThemeSlugsByPuzzleIds(supabase, [id]);
  return puzzleThemeService.withThemeSlugs(puzzle, slugsByPuzzleId.get(id) ?? []);
}

export async function createPuzzle(
  supabase: SupabaseClient,
  input: puzzleRepo.CreatePuzzleInput,
): Promise<Puzzle | null> {
  return puzzleRepo.create(supabase, input);
}

export async function updatePuzzle(
  supabase: SupabaseClient,
  id: string,
  input: puzzleRepo.UpdatePuzzleInput,
): Promise<Puzzle | null> {
  return puzzleRepo.update(supabase, id, input);
}

export async function deletePuzzle(supabase: SupabaseClient, id: string): Promise<boolean> {
  return puzzleRepo.remove(supabase, id);
}
