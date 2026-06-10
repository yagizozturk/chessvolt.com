/**
 * Onboarding Question Repository
 *
 * Responsibility: CRUD access to the onboarding_questions table.
 */

import {
  toOnboardingQuestion,
  toOnboardingQuestions,
  type DbOnboardingQuestion,
} from "@/features/onboarding-question/mapper/onboarding-question.mapper";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import { slugify } from "@/lib/utils/slugify";
import type { SupabaseClient } from "@supabase/supabase-js";

function slugFromTitle(title: string): string {
  return slugify(title) || "onboarding-question";
}

export async function findAll(supabase: SupabaseClient): Promise<OnboardingQuestion[]> {
  const { data, error } = await supabase
    .from("onboarding_questions")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("onboarding-question.repository.findAll error:", error);
    return [];
  }

  return toOnboardingQuestions((data ?? []) as DbOnboardingQuestion[]);
}

export async function findAllActive(supabase: SupabaseClient): Promise<OnboardingQuestion[]> {
  const { data, error } = await supabase
    .from("onboarding_questions")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("onboarding-question.repository.findAllActive error:", error);
    return [];
  }

  return toOnboardingQuestions((data ?? []) as DbOnboardingQuestion[]);
}

export async function findById(supabase: SupabaseClient, id: string): Promise<OnboardingQuestion | null> {
  const { data, error } = await supabase
    .from("onboarding_questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("onboarding-question.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toOnboardingQuestion(data as DbOnboardingQuestion);
}

export type CreateOnboardingQuestionInput = {
  title: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOnboardingQuestionInput,
): Promise<OnboardingQuestion | null> {
  const { data, error } = await supabase
    .from("onboarding_questions")
    .insert({
      title: input.title.trim(),
      slug: input.slug?.trim() || slugFromTitle(input.title),
      sort_order: input.sortOrder ?? 0,
      is_active: input.isActive ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("onboarding-question.repository.create error:", error);
    return null;
  }

  return toOnboardingQuestion(data as DbOnboardingQuestion);
}

export type UpdateOnboardingQuestionInput = {
  title?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOnboardingQuestionInput,
): Promise<OnboardingQuestion | null> {
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.slug !== undefined) updates.slug = input.slug.trim();
  if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;
  if (input.isActive !== undefined) updates.is_active = input.isActive;

  const { data, error } = await supabase
    .from("onboarding_questions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("onboarding-question.repository.update error:", error);
    return null;
  }

  return toOnboardingQuestion(data as DbOnboardingQuestion);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("onboarding_questions").delete().eq("id", id);

  if (error) {
    console.error("onboarding-question.repository.remove error:", error);
    return false;
  }

  return true;
}
