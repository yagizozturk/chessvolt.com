// TODO: Refactor
/**
 * Onboarding Option Theme Repository
 *
 * Responsibility: CRUD access to the onboarding_option_themes join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbOnboardingOptionTheme,
  type DbOnboardingOptionThemeWithDetails,
  type DbOnboardingOptionThemeWithTheme,
  toOnboardingOptionTheme,
  toOnboardingOptionThemeWithDetails,
  toOnboardingOptionThemesWithDetails,
  toOnboardingOptionThemesWithTheme,
} from "@/features/onboarding-option-theme/mapper/onboarding-option-theme.mapper";
import type {
  OnboardingOptionTheme,
  OnboardingOptionThemeWithDetails,
  OnboardingOptionThemeWithTheme,
} from "@/features/onboarding-option-theme/types/onboarding-option-theme";

export async function findById(supabase: SupabaseClient, id: string): Promise<OnboardingOptionTheme | null> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select("*")
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
    .select("*, themes (*), onboarding_options (*, onboarding_questions (*))")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("onboarding-option-theme.repository.findByIdWithDetails error:", error);
    return null;
  }

  if (!data) return null;

  return toOnboardingOptionThemeWithDetails(data as DbOnboardingOptionThemeWithDetails);
}

export async function findAllWithDetails(supabase: SupabaseClient): Promise<OnboardingOptionThemeWithDetails[]> {
  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select("*, themes (*), onboarding_options (*, onboarding_questions (*))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("onboarding-option-theme.repository.findAllWithDetails error:", error);
    return [];
  }

  return toOnboardingOptionThemesWithDetails((data ?? []) as DbOnboardingOptionThemeWithDetails[]);
}

export async function findByOptionIds(
  supabase: SupabaseClient,
  optionIds: string[],
): Promise<OnboardingOptionThemeWithTheme[]> {
  if (optionIds.length === 0) return [];

  const { data, error } = await supabase
    .from("onboarding_option_themes")
    .select("*, themes (*)")
    .in("option_id", optionIds)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("onboarding-option-theme.repository.findByOptionIds error:", error);
    return [];
  }

  return toOnboardingOptionThemesWithTheme((data ?? []) as DbOnboardingOptionThemeWithTheme[]);
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

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("onboarding_option_themes").delete().eq("id", id);

  if (error) {
    console.error("onboarding-option-theme.repository.remove error:", error);
    return false;
  }

  return true;
}
