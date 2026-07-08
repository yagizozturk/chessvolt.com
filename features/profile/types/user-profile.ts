// TODO: Refactor
import type { ProfileRole } from "@/features/profile/types/profile";

export type UserProfileData = {
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: ProfileRole;
  onboardingCompleted: boolean;
  initialRating: number | null;
  currentRating: number | null;
};
