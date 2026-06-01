"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteUserOnboardingAnswer,
  updateUserOnboardingAnswer,
} from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";
import { getAdminUser } from "@/lib/supabase/auth";

function parseOptionId(formData: FormData): string | null {
  const raw = (formData.get("optionId") as string | null)?.trim() ?? "";
  return raw || null;
}

export type UpdateUserOnboardingAnswerFormState = {
  error: string | null;
};

export async function updateUserOnboardingAnswerAction(
  _prevState: UpdateUserOnboardingAnswerFormState,
  formData: FormData,
): Promise<UpdateUserOnboardingAnswerFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("answerId") as string)?.trim();
  if (!id) {
    return { error: "Missing answer id. Refresh the page and try again." };
  }

  const optionId = parseOptionId(formData);
  if (!optionId) {
    return { error: "Option is required." };
  }

  const answer = await updateUserOnboardingAnswer(supabase, id, { optionId });
  if (!answer) {
    return { error: "Could not save changes. The option may not belong to this question." };
  }

  revalidatePath("/admin/user-onboarding-answers");
  redirect("/admin/user-onboarding-answers");
}

export async function deleteUserOnboardingAnswerAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteUserOnboardingAnswer(supabase, id);
  if (!ok) {
    redirect("/admin/user-onboarding-answers?error=delete_failed");
  }

  revalidatePath("/admin/user-onboarding-answers");
  redirect("/admin/user-onboarding-answers");
}
