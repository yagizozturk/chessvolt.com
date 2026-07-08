// TODO: Refactor
/**
 * Collection Theme Repository
 *
 * Responsibility: CRUD access to the collection_themes join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  toCollectionTheme,
  toCollectionThemesWithTheme,
  toCollectionThemeWithTheme,
  type DbCollectionTheme,
  type DbCollectionThemeWithTheme,
} from "@/features/collection-theme/mapper/collection-theme.mapper";
import type { CollectionTheme, CollectionThemeWithTheme } from "@/features/collection-theme/types/collection-theme";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";

const SELECT = "*";
const WITH_THEME_SELECT = "*, themes (*)";

export async function findById(supabase: SupabaseClient, id: string): Promise<CollectionTheme | null> {
  const { data, error } = await supabase.from("collection_themes").select(SELECT).eq("id", id).maybeSingle();

  if (error) {
    console.error("collection-theme.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toCollectionTheme(data as DbCollectionTheme);
}

export async function findByIdWithTheme(
  supabase: SupabaseClient,
  id: string,
): Promise<CollectionThemeWithTheme | null> {
  const { data, error } = await supabase
    .from("collection_themes")
    .select(WITH_THEME_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("collection-theme.repository.findByIdWithTheme error:", error);
    return null;
  }

  if (!data) return null;

  return toCollectionThemeWithTheme(data as DbCollectionThemeWithTheme);
}

export async function findAllWithTheme(supabase: SupabaseClient): Promise<CollectionThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("collection_themes")
    .select(WITH_THEME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("collection-theme.repository.findAllWithTheme error:", error);
    return [];
  }

  return toCollectionThemesWithTheme((data ?? []) as DbCollectionThemeWithTheme[]);
}

export async function findByCollectionIdWithTheme(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<CollectionThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("collection_themes")
    .select(WITH_THEME_SELECT)
    .eq("collection_id", collectionId)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("collection-theme.repository.findByCollectionIdWithTheme error:", error);
    return [];
  }

  return toCollectionThemesWithTheme((data ?? []) as DbCollectionThemeWithTheme[]);
}

export type CreateCollectionThemeInput = {
  collectionId: string;
  themeId: string;
  weight?: ThemeLinkWeight;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateCollectionThemeInput,
): Promise<CollectionTheme | null> {
  const { data, error } = await supabase
    .from("collection_themes")
    .insert({
      collection_id: input.collectionId,
      theme_id: input.themeId,
      weight: input.weight ?? DEFAULT_THEME_LINK_WEIGHT,
    })
    .select()
    .single();

  if (error) {
    console.error("collection-theme.repository.create error:", error);
    return null;
  }

  return toCollectionTheme(data as DbCollectionTheme);
}

export type UpdateCollectionThemeInput = {
  weight?: ThemeLinkWeight;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateCollectionThemeInput,
): Promise<CollectionTheme | null> {
  const updates: Record<string, unknown> = {};
  if (input.weight !== undefined) updates.weight = input.weight;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase.from("collection_themes").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("collection-theme.repository.update error:", error);
    return null;
  }

  return toCollectionTheme(data as DbCollectionTheme);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("collection_themes").delete().eq("id", id);

  if (error) {
    console.error("collection-theme.repository.remove error:", error);
    return false;
  }

  return true;
}
