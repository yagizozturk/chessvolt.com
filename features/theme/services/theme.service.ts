/**
 * Theme Service
 *
 * Responsibility: Theme business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */

import * as themeRepo from "@/features/theme/repository/theme.repository";
import type { Theme } from "@/features/theme/types/theme";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAllThemes(supabase: SupabaseClient): Promise<Theme[]> {
  return themeRepo.findAll(supabase);
}

export async function getThemeById(supabase: SupabaseClient, id: string): Promise<Theme | null> {
  return themeRepo.findById(supabase, id);
}

export async function createTheme(
  supabase: SupabaseClient,
  input: themeRepo.CreateThemeInput,
): Promise<Theme | null> {
  return themeRepo.create(supabase, input);
}

export async function updateTheme(
  supabase: SupabaseClient,
  id: string,
  input: themeRepo.UpdateThemeInput,
): Promise<Theme | null> {
  return themeRepo.update(supabase, id, input);
}

export async function deleteTheme(supabase: SupabaseClient, id: string): Promise<boolean> {
  return themeRepo.remove(supabase, id);
}
