// TODO: Refactor
"use server";

import { revalidatePath } from "next/cache";

import * as profileService from "@/features/profile/services/profile.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type UpdateUsernameFormState = {
  error: string | null;
  success: boolean;
};

const MAX_USERNAME_LENGTH = 50;

export async function updateUsernameAction(
  _prevState: UpdateUsernameFormState,
  formData: FormData,
): Promise<UpdateUsernameFormState> {
  const username = String(formData.get("username") ?? "").trim();

  if (!username) {
    return { error: "Username is required.", success: false };
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return { error: `Username must be ${MAX_USERNAME_LENGTH} characters or fewer.`, success: false };
  }

  const { user, supabase } = await getAuthenticatedUser();
  const updated = await profileService.updateProfileUsername(supabase, user.id, username);

  if (!updated) {
    return { error: "Could not update username. Please try again.", success: false };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { error: null, success: true };
}
