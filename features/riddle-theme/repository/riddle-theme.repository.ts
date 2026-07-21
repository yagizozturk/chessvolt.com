// TODO: Refactor
/**
 * Riddle Theme Repository
 *
 * Responsibility: CRUD access to the riddle_themes join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  toRiddleTheme,
  toRiddleThemes,
  toRiddleThemesWithTheme,
  toRiddleThemeWithTheme,
  type DbRiddleTheme,
  type DbRiddleThemeWithTheme,
} from "@/features/riddle-theme/mapper/riddle-theme.mapper";
import type { RiddleTheme, RiddleThemeWithTheme } from "@/features/riddle-theme/types/riddle-theme";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";

const SELECT = "*";
const WITH_THEME_SELECT = "*, themes (*)";

export async function findById(supabase: SupabaseClient, id: string): Promise<RiddleTheme | null> {
  const { data, error } = await supabase.from("riddle_themes").select(SELECT).eq("id", id).maybeSingle();

  if (error) {
    console.error("riddle-theme.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toRiddleTheme(data as DbRiddleTheme);
}

export async function findByIdWithTheme(
  supabase: SupabaseClient,
  id: string,
): Promise<RiddleThemeWithTheme | null> {
  const { data, error } = await supabase
    .from("riddle_themes")
    .select(WITH_THEME_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("riddle-theme.repository.findByIdWithTheme error:", error);
    return null;
  }

  if (!data) return null;

  return toRiddleThemeWithTheme(data as DbRiddleThemeWithTheme);
}

export async function findAllWithTheme(supabase: SupabaseClient): Promise<RiddleThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("riddle_themes")
    .select(WITH_THEME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("riddle-theme.repository.findAllWithTheme error:", error);
    return [];
  }

  return toRiddleThemesWithTheme((data ?? []) as DbRiddleThemeWithTheme[]);
}

export async function findByRiddleIdsWithTheme(
  supabase: SupabaseClient,
  riddleIds: string[],
): Promise<RiddleThemeWithTheme[]> {
  const uniqueIds = [...new Set(riddleIds.map((id) => id.trim()).filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const { data, error } = await supabase
    .from("riddle_themes")
    .select(WITH_THEME_SELECT)
    .in("riddle_id", uniqueIds)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("riddle-theme.repository.findByRiddleIdsWithTheme error:", error);
    return [];
  }

  return toRiddleThemesWithTheme((data ?? []) as DbRiddleThemeWithTheme[]);
}

export type CreateRiddleThemeInput = {
  riddleId: string;
  themeId: string;
  weight?: ThemeLinkWeight;
};

export async function create(supabase: SupabaseClient, input: CreateRiddleThemeInput): Promise<RiddleTheme | null> {
  const { data, error } = await supabase
    .from("riddle_themes")
    .insert({
      riddle_id: input.riddleId,
      theme_id: input.themeId,
      weight: input.weight ?? DEFAULT_THEME_LINK_WEIGHT,
    })
    .select()
    .single();

  if (error) {
    console.error("riddle-theme.repository.create error:", error);
    return null;
  }

  return toRiddleTheme(data as DbRiddleTheme);
}

export async function createMany(
  supabase: SupabaseClient,
  inputs: CreateRiddleThemeInput[],
): Promise<RiddleTheme[]> {
  if (inputs.length === 0) return [];

  const rows = inputs.map((input) => ({
    riddle_id: input.riddleId,
    theme_id: input.themeId,
    weight: input.weight ?? DEFAULT_THEME_LINK_WEIGHT,
  }));

  const { data, error } = await supabase.from("riddle_themes").insert(rows).select();

  if (error) {
    console.error("riddle-theme.repository.createMany error:", error);
    return [];
  }

  return toRiddleThemes((data ?? []) as DbRiddleTheme[]);
}

export type UpdateRiddleThemeInput = {
  weight?: ThemeLinkWeight;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateRiddleThemeInput,
): Promise<RiddleTheme | null> {
  const updates: Record<string, unknown> = {};
  if (input.weight !== undefined) updates.weight = input.weight;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase.from("riddle_themes").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("riddle-theme.repository.update error:", error);
    return null;
  }

  return toRiddleTheme(data as DbRiddleTheme);
}

export async function replaceForRiddle(
  supabase: SupabaseClient,
  riddleId: string,
  inputs: CreateRiddleThemeInput[],
): Promise<RiddleTheme[]> {
  const { error: deleteError } = await supabase.from("riddle_themes").delete().eq("riddle_id", riddleId);

  if (deleteError) {
    console.error("riddle-theme.repository.replaceForRiddle delete error:", deleteError);
    return [];
  }

  return createMany(supabase, inputs);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("riddle_themes").delete().eq("id", id);

  if (error) {
    console.error("riddle-theme.repository.remove error:", error);
    return false;
  }

  return true;
}

export async function removeByRiddleId(supabase: SupabaseClient, riddleId: string): Promise<boolean> {
  const { error } = await supabase.from("riddle_themes").delete().eq("riddle_id", riddleId);

  if (error) {
    console.error("riddle-theme.repository.removeByRiddleId error:", error);
    return false;
  }

  return true;
}
