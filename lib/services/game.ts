/**
 * Game Service
 *
 * Responsibility: Game business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Game } from "@/lib/model/game";
import * as gameRepo from "@/lib/repositories/game.repository";

export async function getAllGames(
  supabase: SupabaseClient
): Promise<Game[]> {
  return gameRepo.findAll(supabase);
}

export async function getGameById(
  supabase: SupabaseClient,
  id: string
): Promise<Game | null> {
  return gameRepo.findById(supabase, id);
}

export async function createGame(
  supabase: SupabaseClient,
  input: gameRepo.CreateGameInput
): Promise<Game | null> {
  return gameRepo.create(supabase, input);
}

export async function updateGame(
  supabase: SupabaseClient,
  id: string,
  input: gameRepo.UpdateGameInput
): Promise<Game | null> {
  return gameRepo.update(supabase, id, input);
}

export async function deleteGame(
  supabase: SupabaseClient,
  id: string
): Promise<boolean> {
  return gameRepo.remove(supabase, id);
}
