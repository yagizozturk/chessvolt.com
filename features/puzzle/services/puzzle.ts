/**
 * Puzzle Service
 *
 * Responsibility: Puzzle business logic and orchestration.
 * - Uses repositories (does not touch Supabase directly)
 * - getNextPuzzleForUser, getUnsolvedPuzzlesForUser: business logic (filtering, ordering)
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import * as puzzleRepo from "@/features/puzzle/repository/puzzle.repository";
import * as userPuzzleRepo from "@/features/puzzle/repository/user-puzzle.repository";

export async function getAllPuzzles(
  supabase: SupabaseClient,
): Promise<Puzzle[]> {
  return puzzleRepo.findAll(supabase);
}

export async function getPuzzleById(
  supabase: SupabaseClient,
  id: string,
): Promise<Puzzle | null> {
  return puzzleRepo.findById(supabase, id);
}

export async function getIncorrectPuzzlesForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<Puzzle[]> {
  const ids = await userPuzzleRepo.findIncorrectPuzzleIds(supabase, userId);
  if (ids.length === 0) return [];

  return puzzleRepo.findByIds(supabase, ids);
}

export async function getUnsolvedPuzzlesForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<Puzzle[]> {
  const attemptedIds = (
    await userPuzzleRepo.findAttemptedPuzzleAttempts(supabase, userId)
  ).map((a) => a.puzzleId);
  const allPuzzles = await puzzleRepo.findAll(supabase);

  return allPuzzles.filter((puzzle) => !attemptedIds.includes(puzzle.id));
}

export async function getNextPuzzleForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<Puzzle | null> {
  const unsolved = await getUnsolvedPuzzlesForUser(supabase, userId);
  if (!unsolved || unsolved.length === 0) return null;

  return unsolved[0];
}

export async function updatePuzzleAnswer(
  supabase: SupabaseClient,
  userId: string,
  puzzleId: string,
  isCorrect: boolean,
): Promise<void> {
  return userPuzzleRepo.upsert(supabase, userId, puzzleId, isCorrect);
}
