// TODO: Refactor
/**
 * Opening Variant Theme Repository
 *
 * Responsibility: CRUD access to the opening_variant_themes join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  toOpeningVariantTheme,
  toOpeningVariantThemesWithTheme,
  toOpeningVariantThemeWithTheme,
  type DbOpeningVariantTheme,
  type DbOpeningVariantThemeWithTheme,
} from "@/features/opening-variant-theme/mapper/opening-variant-theme.mapper";
import type {
  OpeningVariantTheme,
  OpeningVariantThemeWithTheme,
} from "@/features/opening-variant-theme/types/opening-variant-theme";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";

const SELECT = "*";
const WITH_THEME_SELECT = "*, themes (*)";

export async function findByIdWithTheme(
  supabase: SupabaseClient,
  id: string,
): Promise<OpeningVariantThemeWithTheme | null> {
  const { data, error } = await supabase
    .from("opening_variant_themes")
    .select(WITH_THEME_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("opening-variant-theme.repository.findByIdWithTheme error:", error);
    return null;
  }

  if (!data) return null;

  return toOpeningVariantThemeWithTheme(data as DbOpeningVariantThemeWithTheme);
}

export async function findAllWithTheme(supabase: SupabaseClient): Promise<OpeningVariantThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("opening_variant_themes")
    .select(WITH_THEME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("opening-variant-theme.repository.findAllWithTheme error:", error);
    return [];
  }

  return toOpeningVariantThemesWithTheme((data ?? []) as DbOpeningVariantThemeWithTheme[]);
}

export async function findByOpeningVariantIdWithTheme(
  supabase: SupabaseClient,
  openingVariantId: string,
): Promise<OpeningVariantThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("opening_variant_themes")
    .select(WITH_THEME_SELECT)
    .eq("opening_variant_id", openingVariantId)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("opening-variant-theme.repository.findByOpeningVariantIdWithTheme error:", error);
    return [];
  }

  return toOpeningVariantThemesWithTheme((data ?? []) as DbOpeningVariantThemeWithTheme[]);
}

export type CreateOpeningVariantThemeInput = {
  openingVariantId: string;
  themeId: string;
  weight?: ThemeLinkWeight;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOpeningVariantThemeInput,
): Promise<OpeningVariantTheme | null> {
  const { data, error } = await supabase
    .from("opening_variant_themes")
    .insert({
      opening_variant_id: input.openingVariantId,
      theme_id: input.themeId,
      weight: input.weight ?? DEFAULT_THEME_LINK_WEIGHT,
    })
    .select()
    .single();

  if (error) {
    console.error("opening-variant-theme.repository.create error:", error);
    return null;
  }

  return toOpeningVariantTheme(data as DbOpeningVariantTheme);
}

export type UpdateOpeningVariantThemeInput = {
  weight?: ThemeLinkWeight;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOpeningVariantThemeInput,
): Promise<OpeningVariantTheme | null> {
  const updates: Record<string, unknown> = {};
  if (input.weight !== undefined) updates.weight = input.weight;

  if (Object.keys(updates).length === 0) {
    const existing = await findByIdWithTheme(supabase, id);
    if (!existing) return null;
    const { theme: _theme, ...rest } = existing;
    return rest;
  }

  const { data, error } = await supabase
    .from("opening_variant_themes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("opening-variant-theme.repository.update error:", error);
    return null;
  }

  return toOpeningVariantTheme(data as DbOpeningVariantTheme);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("opening_variant_themes").delete().eq("id", id);

  if (error) {
    console.error("opening-variant-theme.repository.remove error:", error);
    return false;
  }

  return true;
}
