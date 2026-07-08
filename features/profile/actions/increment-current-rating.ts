// TODO: Refactor
"use server";

import * as profileService from "@/features/profile/services/profile.service";
import { getPublicUser } from "@/lib/supabase/auth";

export async function incrementCurrentRatingAction(): Promise<number | null> {
  const { user, supabase } = await getPublicUser();
  if (!user) return null;

  return profileService.incrementProfileCurrentRating(supabase, user.id);
}
