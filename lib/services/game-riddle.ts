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

export async function getGameRiddlesByGameType(
  supabase: SupabaseClient,
  gameType: string
): Promise<GameRiddle[]> {
  return gameRiddleRepo.findByGameType(supabase, gameType);
}

export async function createGameRiddle(
  supabase: SupabaseClient,
  input: gameRiddleRepo.CreateGameRiddleInput
): Promise<GameRiddle | null> {
  return gameRiddleRepo.create(supabase, input);
}

export async function updateGameRiddle(
  supabase: SupabaseClient,
  id: string,
  input: gameRiddleRepo.UpdateGameRiddleInput
): Promise<GameRiddle | null> {
  return gameRiddleRepo.update(supabase, id, input);
}

export async function deleteGameRiddle(
  supabase: SupabaseClient,
  id: string
): Promise<boolean> {
  return gameRiddleRepo.remove(supabase, id);
}
