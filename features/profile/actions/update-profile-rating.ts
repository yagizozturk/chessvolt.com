// TODO: Refactor
"use server";

import * as profileService from "@/features/profile/services/profile.service";
import type {
  ProfileRatingOutcome,
  UpdateProfileRatingResult,
} from "@/features/profile/services/profile.service";
import { getPublicUser } from "@/lib/supabase/auth";

export async function updateProfileRatingAction(input: {
  sequenceId: string;
  outcome: ProfileRatingOutcome;
}): Promise<UpdateProfileRatingResult | null> {
  const { user, supabase } = await getPublicUser();
  if (!user) return null;

  const sequenceId = input.sequenceId?.trim();
  if (!sequenceId) return null;
  if (input.outcome !== "success" && input.outcome !== "failure") return null;

  return profileService.updateProfileRatingForSequence(supabase, user.id, sequenceId, input.outcome);
}
