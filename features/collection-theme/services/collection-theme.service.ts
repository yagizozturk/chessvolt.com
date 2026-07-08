// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";

import { DEFAULT_TOP_COLLECTION_THEME_COUNT } from "@/features/collection-theme/mapper/collection-theme.mapper";
import * as collectionThemeRepo from "@/features/collection-theme/repository/collection-theme.repository";
import type { CollectionTheme, CollectionThemeWithTheme } from "@/features/collection-theme/types/collection-theme";

export { DEFAULT_TOP_COLLECTION_THEME_COUNT };

export async function getCollectionThemesForCollectionWithTheme(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<CollectionThemeWithTheme[]> {
  return collectionThemeRepo.findByCollectionIdWithTheme(supabase, collectionId);
}

export async function addCollectionTheme(
  supabase: SupabaseClient,
  input: collectionThemeRepo.CreateCollectionThemeInput,
): Promise<CollectionTheme | null> {
  return collectionThemeRepo.create(supabase, input);
}

export async function updateCollectionTheme(
  supabase: SupabaseClient,
  id: string,
  input: collectionThemeRepo.UpdateCollectionThemeInput,
): Promise<CollectionTheme | null> {
  return collectionThemeRepo.update(supabase, id, input);
}

export async function deleteCollectionTheme(supabase: SupabaseClient, id: string): Promise<boolean> {
  return collectionThemeRepo.remove(supabase, id);
}
