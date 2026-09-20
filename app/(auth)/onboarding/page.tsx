import { redirect } from "next/navigation";

import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { DASHBOARD_HOME_URL } from "@/features/onboarding/constants/onboarding-routes";
import { getProfileOnboardingStatus } from "@/features/profile/repository/profile.repository";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

// ======================================================================
// Onboarding page
// ======================================================================
export default async function OnboardingPage() {
  const { user, supabase } = await getAuthenticatedUser();

  // ======================================================================
  // Checking if the user has already completed onboarding. If ok, redirect
  // ======================================================================
  const onboardingStatus = await getProfileOnboardingStatus(supabase, user.id);
  if (onboardingStatus?.onboardingCompleted) {
    redirect(DASHBOARD_HOME_URL);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <OnboardingForm />
    </div>
  );
}
