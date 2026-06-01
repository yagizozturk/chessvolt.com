/**
 * Onboarding Option Theme Repository
 *
 * Responsibility: CRUD access to the onboarding_option_themes join table.
 */

import {
  toOnboardingOptionTheme,
  toOnboardingOptionThemes,
  toOnboardingOptionThemesWithDetails,
  toOnboardingOptionThemesWithTheme,
  toOnboardingOptionThemeWithDetails,
  type DbOnboardingOptionTheme,
  type DbOnboardingOptionThemeWithDetails,
  type DbOnboardingOptionThemeWithTheme,
} from "@/features/onboarding-option-theme/mapper/onboarding-option-theme.mapper";
import type {
  OnboardingOptionTheme,
  OnboardingOptionThemeWithDetails,
  OnboardingOptionThemeWithTheme,
} from "@/features/onboarding-option-theme/types/onboarding-option-theme";
import type { SupabaseClient } from "@supabase/supabase-js";

const LINK_SELECT = "*";
const LINK_WITH_THEME_SELECT = "*, themes (*)";
const LINK_WITH_DETAILS_SELECT = "*, themes (*), onboarding_options (*, onboarding_questions (*))";

export async function findById(supabase: SupabaseClient, id: string): Promise<OnboardingOptionTheme | null> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("onboarding-option-theme.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toOnboardingOptionTheme(data as DbOnboardingOptionTheme);
}

export async function findByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingOptionThemeWithDetails | null> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_WITH_DETAILS_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("onboarding-option-theme.repository.findByIdWithDetails error:", error);
    return null;
  }

  if (!data) return null;

  return toOnboardingOptionThemeWithDetails(data as DbOnboardingOptionThemeWithDetails);
}

export async function findAll(supabase: SupabaseClient): Promise<OnboardingOptionTheme[]> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("onboarding-option-theme.repository.findAll error:", error);
    return [];
  }

  return toOnboardingOptionThemes((data ?? []) as DbOnboardingOptionTheme[]);
}

export async function findAllWithDetails(supabase: SupabaseClient): Promise<OnboardingOptionThemeWithDetails[]> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_WITH_DETAILS_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("onboarding-option-theme.repository.findAllWithDetails error:", error);
    return [];
  }

  return toOnboardingOptionThemesWithDetails((data ?? []) as DbOnboardingOptionThemeWithDetails[]);
}

export async function findByOptionId(
  supabase: SupabaseClient,
  optionId: string,
): Promise<OnboardingOptionTheme[]> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_SELECT)
    .eq("option_id", optionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("onboarding-option-theme.repository.findByOptionId error:", error);
    return [];
  }

  return toOnboardingOptionThemes((data ?? []) as DbOnboardingOptionTheme[]);
}

export async function findByOptionIdWithTheme(
  supabase: SupabaseClient,
  optionId: string,
): Promise<OnboardingOptionThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_WITH_THEME_SELECT)
    .eq("option_id", optionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("onboarding-option-theme.repository.findByOptionIdWithTheme error:", error);
    return [];
  }

  return toOnboardingOptionThemesWithTheme((data ?? []) as DbOnboardingOptionThemeWithTheme[]);
}

export async function findByThemeId(supabase: SupabaseClient, themeId: string): Promise<OnboardingOptionTheme[]> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_SELECT)
    .eq("theme_id", themeId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("onboarding-option-theme.repository.findByThemeId error:", error);
    return [];
  }

  return toOnboardingOptionThemes((data ?? []) as DbOnboardingOptionTheme[]);
}

export async function findByPair(
  supabase: SupabaseClient,
  optionId: string,
  themeId: string,
): Promise<OnboardingOptionTheme | null> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select(LINK_SELECT)
    .eq("option_id", optionId)
    .eq("theme_id", themeId)
    .maybeSingle();

  if (error) {
    console.error("onboarding-option-theme.repository.findByPair error:", error);
    return null;
  }

  if (!data) return null;

  return toOnboardingOptionTheme(data as DbOnboardingOptionTheme);
}

export type CreateOnboardingOptionThemeInput = {
  optionId: string;
  themeId: string;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOnboardingOptionThemeInput,
): Promise<OnboardingOptionTheme | null> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .insert({
      option_id: input.optionId,
      theme_id: input.themeId,
    })
    .select()
    .single();

  if (error) {
    console.error("onboarding-option-theme.repository.create error:", error);
    return null;
  }

  return toOnboardingOptionTheme(data as DbOnboardingOptionTheme);
}

export async function createMany(
  supabase: SupabaseClient,
  inputs: CreateOnboardingOptionThemeInput[],
): Promise<OnboardingOptionTheme[]> {
  if (inputs.length === 0) return [];

  const rows = inputs.map((input) => ({
    option_id: input.optionId,
    theme_id: input.themeId,
  }));

  const { data, error } = await supabase.from("onboarding_option_themes").insert(rows).select();

  if (error) {
    console.error("onboarding-option-theme.repository.createMany error:", error);
    return [];
  }

  return toOnboardingOptionThemes((data ?? []) as DbOnboardingOptionTheme[]);
}

export type UpdateOnboardingOptionThemeInput = {
  optionId?: string;
  themeId?: string;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOnboardingOptionThemeInput,
): Promise<OnboardingOptionTheme | null> {
  const updates: Record<string, unknown> = {};
  if (input.optionId !== undefined) updates.option_id = input.optionId;
  if (input.themeId !== undefined) updates.theme_id = input.themeId;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("onboarding-option-theme.repository.update error:", error);
    return null;
  }

  return toOnboardingOptionTheme(data as DbOnboardingOptionTheme);
}

export async function replaceForOption(
  supabase: SupabaseClient,
  optionId: string,
  themeIds: string[],
): Promise<OnboardingOptionTheme[]> {
  const { error: deleteError } = await supabase
    .from("onboarding_option_themes")
    .delete()
    .eq("option_id", optionId);

  if (deleteError) {
    console.error("onboarding-option-theme.repository.replaceForOption delete error:", deleteError);
    return [];
  }

  return createMany(
    supabase,
    themeIds.map((themeId) => ({ optionId, themeId })),
  );
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("onboarding_option_themes").delete().eq("id", id);

  if (error) {
    console.error("onboarding-option-theme.repository.remove error:", error);
    return false;
  }

  return true;
}

export async function removeByOptionId(supabase: SupabaseClient, optionId: string): Promise<boolean> {
  const { error } = await supabase.from("onboarding_option_themes").delete().eq("option_id", optionId);

  if (error) {
    console.error("onboarding-option-theme.repository.removeByOptionId error:", error);
    return false;
  }

  return true;
}

export async function removeByPair(
  supabase: SupabaseClient,
  optionId: string,
  themeId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("onboarding_option_themes")
    .delete()
    .eq("option_id", optionId)
    .eq("theme_id", themeId);

  if (error) {
    console.error("onboarding-option-theme.repository.removeByPair error:", error);
    return false;
  }

  return true;
}
