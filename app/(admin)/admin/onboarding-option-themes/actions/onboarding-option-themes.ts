"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateOnboardingOptionThemeInput } from "@/features/onboarding-option-theme/repository/onboarding-option-theme.repository";
import {
  addOnboardingOptionTheme,
  deleteOnboardingOptionTheme,
  updateOnboardingOptionTheme,
} from "@/features/onboarding-option-theme/services/onboarding-option-theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

function parseOptionId(formData: FormData): string | null {
  const raw = (formData.get("optionId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseThemeId(formData: FormData): string | null {
  const raw = (formData.get("themeId") as string | null)?.trim() ?? "";
  return raw || null;
}

export async function createOnboardingOptionThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const optionId = parseOptionId(formData);
  const themeId = parseThemeId(formData);

  if (!optionId || !themeId) {
    redirect("/admin/onboarding-option-themes/create?error=missing_fields");
  }

  const input: CreateOnboardingOptionThemeInput = { optionId, themeId };

  const link = await addOnboardingOptionTheme(supabase, input);
  if (!link) {
    redirect("/admin/onboarding-option-themes/create?error=create_failed");
  }

  revalidatePath("/admin/onboarding-option-themes");
  revalidatePath("/admin/onboarding-options");
  redirect("/admin/onboarding-option-themes");
}

export type UpdateOnboardingOptionThemeFormState = {
  error: string | null;
};

export async function updateOnboardingOptionThemeAction(
  _prevState: UpdateOnboardingOptionThemeFormState,
  formData: FormData,
): Promise<UpdateOnboardingOptionThemeFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("onboardingOptionThemeId") as string)?.trim();
  if (!id) {
    return { error: "Missing link id. Refresh the page and try again." };
  }

  const optionId = parseOptionId(formData);
  const themeId = parseThemeId(formData);

  if (!optionId || !themeId) {
    return { error: "Option and theme are required." };
  }

  const link = await updateOnboardingOptionTheme(supabase, id, { optionId, themeId });
  if (!link) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/onboarding-option-themes");
  revalidatePath("/admin/onboarding-options");
  redirect("/admin/onboarding-option-themes");
}

export async function deleteOnboardingOptionThemeAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteOnboardingOptionTheme(supabase, id);
  if (!ok) {
    redirect("/admin/onboarding-option-themes?error=delete_failed");
  }

  revalidatePath("/admin/onboarding-option-themes");
  revalidatePath("/admin/onboarding-options");
  redirect("/admin/onboarding-option-themes");
}
