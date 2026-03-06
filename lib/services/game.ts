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

export async function getGamesByUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Game[]> {
  return gameRepo.findByCreatedBy(supabase, userId);
}
