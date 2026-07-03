"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  CreateOnboardingOptionInput,
  UpdateOnboardingOptionInput,
} from "@/features/onboarding-option/repository/onboarding-option.repository";
import {
  createOnboardingOption,
  deleteOnboardingOption,
  updateOnboardingOption,
} from "@/features/onboarding-option/services/onboarding-option.service";
import {
  parseOnboardingInitialRating,
} from "@/features/onboarding-option/types/onboarding-rating";
import { getAdminUser } from "@/lib/supabase/auth";

function parseSortOrder(raw: FormDataEntryValue | null): number {
  const value = parseInt(String(raw ?? ""), 10);
  return Number.isFinite(value) ? value : 0;
}

function parseIsActive(formData: FormData): boolean {
  return formData.get("isActive") === "on";
}

function parseQuestionId(formData: FormData): string | null {
  const raw = (formData.get("questionId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseOptionalRating(formData: FormData): number | null | "invalid" {
  const raw = formData.get("initialRating");
  if (raw === null || String(raw).trim() === "") return null;
  const parsed = parseOnboardingInitialRating(raw);
  return parsed === null ? "invalid" : parsed;
}

export async function createOnboardingOptionAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const questionId = parseQuestionId(formData);
  const value = (formData.get("value") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);
  const initialRating = parseOptionalRating(formData);

  if (!questionId || !value || !label) {
    redirect("/admin/onboarding-options/create?error=missing_fields");
  }

  if (initialRating === "invalid") {
    redirect("/admin/onboarding-options/create?error=invalid_rating");
  }

  const input: CreateOnboardingOptionInput = {
    questionId,
    value,
    label,
    sortOrder,
    isActive,
    initialRating,
  };

  const option = await createOnboardingOption(supabase, input);
  if (!option) {
    redirect("/admin/onboarding-options/create?error=create_failed");
  }

  revalidatePath("/admin/onboarding-options");
  revalidatePath("/admin/onboarding-questions");
  redirect("/admin/onboarding-options");
}

export type UpdateOnboardingOptionFormState = {
  error: string | null;
};

export async function updateOnboardingOptionAction(
  _prevState: UpdateOnboardingOptionFormState,
  formData: FormData,
): Promise<UpdateOnboardingOptionFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("onboardingOptionId") as string)?.trim();
  if (!id) {
    return { error: "Missing option id. Refresh the page and try again." };
  }

  const questionId = parseQuestionId(formData);
  const value = (formData.get("value") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);
  const initialRating = parseOptionalRating(formData);

  if (!questionId || !value || !label) {
    return { error: "Question, value, and label are required." };
  }

  if (initialRating === "invalid") {
    return { error: "Initial rating must be 100–3000." };
  }

  const input: UpdateOnboardingOptionInput = {
    questionId,
    value,
    label,
    sortOrder,
    isActive,
    initialRating,
  };

  const option = await updateOnboardingOption(supabase, id, input);
  if (!option) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/onboarding-options");
  revalidatePath("/admin/onboarding-questions");
  redirect("/admin/onboarding-options");
}

export async function deleteOnboardingOptionAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteOnboardingOption(supabase, id);
  if (!ok) {
    redirect("/admin/onboarding-options?error=delete_failed");
  }

  revalidatePath("/admin/onboarding-options");
  revalidatePath("/admin/onboarding-questions");
  redirect("/admin/onboarding-options");
}
