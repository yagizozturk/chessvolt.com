"use server";

import { revalidatePath } from "next/cache";

import * as profileService from "@/features/profile/services/profile.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type UpdatePlatformUsernamesFormState = {
  error: string | null;
  success: boolean;
};

const MAX_PLATFORM_USERNAME_LENGTH = 50;

function normalizePlatformUsername(value: FormDataEntryValue | null): string | null {
  const username = String(value ?? "").trim();
  return username || null;
}

export async function updatePlatformUsernamesAction(
  _prevState: UpdatePlatformUsernamesFormState,
  formData: FormData,
): Promise<UpdatePlatformUsernamesFormState> {
  const chesscomUsername = normalizePlatformUsername(formData.get("chesscomUsername"));
  const lichessUsername = normalizePlatformUsername(formData.get("lichessUsername"));

  if (
    (chesscomUsername && chesscomUsername.length > MAX_PLATFORM_USERNAME_LENGTH) ||
    (lichessUsername && lichessUsername.length > MAX_PLATFORM_USERNAME_LENGTH)
  ) {
    return { error: `Usernames must be ${MAX_PLATFORM_USERNAME_LENGTH} characters or fewer.`, success: false };
  }

  const { user, supabase } = await getAuthenticatedUser();
  const updated = await profileService.updateProfilePlatformUsernames(supabase, user.id, {
    chesscomUsername,
    lichessUsername,
  });

  if (!updated) {
    return { error: "Could not update linked accounts. Please try again.", success: false };
  }

  revalidatePath("/profile");

  return { error: null, success: true };
}
