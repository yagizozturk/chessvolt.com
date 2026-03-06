/**
 * Game Riddle Service
 *
 * Responsibility: Game riddle business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { GameRiddle } from "@/lib/model/game-riddle";
import * as gameRiddleRepo from "@/lib/repositories/game-riddle.repository";

export async function getAllGameRiddles(
  supabase: SupabaseClient
): Promise<GameRiddle[]> {
  return gameRiddleRepo.findAll(supabase);
}

export async function getGameRiddleById(
  supabase: SupabaseClient,
  id: string
): Promise<GameRiddle | null> {
  return gameRiddleRepo.findById(supabase, id);
}

export async function getGameRiddlesByGameId(
  supabase: SupabaseClient,
  gameId: string
): Promise<GameRiddle[]> {
  return gameRiddleRepo.findByGameId(supabase, gameId);
}

export async function getGameRiddlesByUser(
  supabase: SupabaseClient,
  userId: string
): Promise<GameRiddle[]> {
  return gameRiddleRepo.findByCreatedBy(supabase, userId);
}

export async function getGameRiddlesByGameType(
  supabase: SupabaseClient,
  gameType: string
): Promise<GameRiddle[]> {
  return gameRiddleRepo.findByGameType(supabase, gameType);
}
