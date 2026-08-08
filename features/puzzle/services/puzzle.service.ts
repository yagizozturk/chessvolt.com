/**
 * Puzzle Service
 *
 * Responsibility: Puzzle business logic and orchestration.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as puzzleThemeService from "@/features/puzzle-theme/services/puzzle-theme.service";
import * as puzzleRepo from "@/features/puzzle/repository/puzzle.repository";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import type { PuzzleWithThemes } from "@/features/puzzle/types/puzzle-with-themes";

export async function getPuzzleById(supabase: SupabaseClient, id: string): Promise<Puzzle | null> {
  return puzzleRepo.findById(supabase, id);
}

export async function getAllActivePuzzles(supabase: SupabaseClient): Promise<Puzzle[]> {
  return puzzleRepo.findAllActive(supabase);
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
