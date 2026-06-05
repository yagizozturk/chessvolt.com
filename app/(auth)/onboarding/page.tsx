import { redirect } from "next/navigation";

import { getOnboardingOptionsForQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { POST_ONBOARDING_URL } from "@/features/onboarding/constants/onboarding-routes";
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
    redirect(POST_ONBOARDING_URL);
  }

  // ======================================================================
  // Getting the active onboarding questions
  // ======================================================================
  const questions = await getActiveOnboardingQuestions(supabase);

  // ======================================================================
  // Getting the active onboarding options for the questions
  // ======================================================================
  const questionSteps = await Promise.all(
    questions.map(async (question) => ({
      question,
      options: await getOnboardingOptionsForQuestion(supabase, question.id, { activeOnly: true }),
    })),
  );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <OnboardingForm questionGroups={questionSteps} />
    </div>
  );
}
