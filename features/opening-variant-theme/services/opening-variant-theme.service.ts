import type { SupabaseClient } from "@supabase/supabase-js";

import * as openingVariantThemeRepo from "@/features/opening-variant-theme/repository/opening-variant-theme.repository";
import type { OpeningVariantThemeWithTheme } from "@/features/opening-variant-theme/types/opening-variant-theme";

export async function getOpeningVariantThemesForVariantWithTheme(
  supabase: SupabaseClient,
  openingVariantId: string,
): Promise<OpeningVariantThemeWithTheme[]> {
  return openingVariantThemeRepo.findByOpeningVariantIdWithTheme(supabase, openingVariantId);
}

export async function addOpeningVariantTheme(
  supabase: SupabaseClient,
  input: openingVariantThemeRepo.CreateOpeningVariantThemeInput,
) {
  return openingVariantThemeRepo.create(supabase, input);
}

export async function updateOpeningVariantTheme(
  supabase: SupabaseClient,
  id: string,
  input: openingVariantThemeRepo.UpdateOpeningVariantThemeInput,
) {
  return openingVariantThemeRepo.update(supabase, id, input);
}

export async function deleteOpeningVariantTheme(supabase: SupabaseClient, id: string): Promise<boolean> {
  return openingVariantThemeRepo.remove(supabase, id);
}
