/**
 * Onboarding Option Repository
 *
 * Responsibility: CRUD access to the onboarding_options table.
 */

import {
  toOnboardingOption,
  toOnboardingOptions,
  toOnboardingOptionsWithQuestion,
  toOnboardingOptionWithQuestion,
  type DbOnboardingOption,
  type DbOnboardingOptionWithQuestion,
} from "@/features/onboarding-option/mapper/onboarding-option.mapper";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";
import type { SupabaseClient } from "@supabase/supabase-js";

const OPTION_SELECT = "*";
const OPTION_WITH_QUESTION_SELECT = "*, onboarding_questions (*)";

export async function findAllWithQuestion(supabase: SupabaseClient): Promise<OnboardingOptionWithQuestion[]> {
  const { data, error } = await supabase
    .from("onboarding_options")
    .select(OPTION_WITH_QUESTION_SELECT)
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    console.error("onboarding-option.repository.findAllWithQuestion error:", error);
    return [];
  }

  return toOnboardingOptionsWithQuestion((data ?? []) as DbOnboardingOptionWithQuestion[]);
}

export async function findByQuestionId(
  supabase: SupabaseClient,
  questionId: string,
  options?: { activeOnly?: boolean },
): Promise<OnboardingOption[]> {
  let query = supabase.from("onboarding_options").select(OPTION_SELECT).eq("question_id", questionId);

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    console.error("onboarding-option.repository.findByQuestionId error:", error);
    return [];
  }

  return toOnboardingOptions((data ?? []) as DbOnboardingOption[]);
}

export async function findByIds(supabase: SupabaseClient, ids: string[]): Promise<OnboardingOption[]> {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const { data, error } = await supabase
    .from("onboarding_options")
    .select(OPTION_SELECT)
    .in("id", uniqueIds);

  if (error) {
    console.error("onboarding-option.repository.findByIds error:", error);
    return [];
  }

  return toOnboardingOptions((data ?? []) as DbOnboardingOption[]);
}

export async function findByIdWithQuestion(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingOptionWithQuestion | null> {
  const { data, error } = await supabase
    .from("onboarding_options")
    .select(OPTION_WITH_QUESTION_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("onboarding-option.repository.findByIdWithQuestion error:", error);
    return null;
  }

  if (!data) return null;

  return toOnboardingOptionWithQuestion(data as DbOnboardingOptionWithQuestion);
}

export type CreateOnboardingOptionInput = {
  questionId: string;
  value: string;
  label: string;
  sortOrder?: number;
  isActive?: boolean;
  initialRating?: number | null;
  initialRatingDeviation?: number | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOnboardingOptionInput,
): Promise<OnboardingOption | null> {
  const { data, error } = await supabase
    .from("onboarding_options")
    .insert({
      question_id: input.questionId,
      value: input.value.trim(),
      label: input.label.trim(),
      sort_order: input.sortOrder ?? 0,
      is_active: input.isActive ?? true,
      initial_rating: input.initialRating ?? null,
      initial_rating_deviation: input.initialRatingDeviation ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("onboarding-option.repository.create error:", error);
    return null;
  }

  return toOnboardingOption(data as DbOnboardingOption);
}

export type UpdateOnboardingOptionInput = {
  questionId?: string;
  value?: string;
  label?: string;
  sortOrder?: number;
  isActive?: boolean;
  initialRating?: number | null;
  initialRatingDeviation?: number | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOnboardingOptionInput,
): Promise<OnboardingOption | null> {
  const updates: Record<string, unknown> = {};
  if (input.questionId !== undefined) updates.question_id = input.questionId;
  if (input.value !== undefined) updates.value = input.value.trim();
  if (input.label !== undefined) updates.label = input.label.trim();
  if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;
  if (input.isActive !== undefined) updates.is_active = input.isActive;
  if (input.initialRating !== undefined) updates.initial_rating = input.initialRating;
  if (input.initialRatingDeviation !== undefined) updates.initial_rating_deviation = input.initialRatingDeviation;

  const { data, error } = await supabase
    .from("onboarding_options")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("onboarding-option.repository.update error:", error);
    return null;
  }

  return toOnboardingOption(data as DbOnboardingOption);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("onboarding_options").delete().eq("id", id);

  if (error) {
    console.error("onboarding-option.repository.remove error:", error);
    return false;
  }

  return true;
}

