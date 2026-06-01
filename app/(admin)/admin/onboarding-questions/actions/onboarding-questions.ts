"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  CreateOnboardingQuestionInput,
  UpdateOnboardingQuestionInput,
} from "@/features/onboarding-question/repository/onboarding-question.repository";
import {
  createOnboardingQuestion,
  deleteOnboardingQuestion,
  updateOnboardingQuestion,
} from "@/features/onboarding-question/services/onboarding-question.service";
import { getAdminUser } from "@/lib/supabase/auth";

function parseSortOrder(raw: FormDataEntryValue | null): number {
  const value = parseInt(String(raw ?? ""), 10);
  return Number.isFinite(value) ? value : 0;
}

function parseIsActive(formData: FormData): boolean {
  return formData.get("isActive") === "on";
}

function parseDescription(formData: FormData): string | null {
  const raw = (formData.get("description") as string | null)?.trim() ?? "";
  return raw || null;
}

export async function createOnboardingQuestionAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = parseDescription(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title) {
    redirect("/admin/onboarding-questions/create?error=missing_fields");
  }

  const input: CreateOnboardingQuestionInput = {
    title,
    slug,
    description,
    sortOrder,
    isActive,
  };

  const question = await createOnboardingQuestion(supabase, input);
  if (!question) {
    redirect("/admin/onboarding-questions/create?error=create_failed");
  }

  revalidatePath("/admin/onboarding-questions");
  redirect("/admin/onboarding-questions");
}

export type UpdateOnboardingQuestionFormState = {
  error: string | null;
};

export async function updateOnboardingQuestionAction(
  _prevState: UpdateOnboardingQuestionFormState,
  formData: FormData,
): Promise<UpdateOnboardingQuestionFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("onboardingQuestionId") as string)?.trim();
  if (!id) {
    return { error: "Missing question id. Refresh the page and try again." };
  }

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = parseDescription(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title) {
    return { error: "Title is required." };
  }

  const input: UpdateOnboardingQuestionInput = {
    title,
    slug,
    description,
    sortOrder,
    isActive,
  };

  const question = await updateOnboardingQuestion(supabase, id, input);
  if (!question) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/onboarding-questions");
  redirect("/admin/onboarding-questions");
}

export async function deleteOnboardingQuestionAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteOnboardingQuestion(supabase, id);
  if (!ok) {
    redirect("/admin/onboarding-questions?error=delete_failed");
  }

  revalidatePath("/admin/onboarding-questions");
  redirect("/admin/onboarding-questions");
}
