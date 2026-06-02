import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { getOnboardingOptionsForQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import { getProfileOnboardingStatus } from "@/features/profile/repository/profile.repository";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function OnboardingPage() {
  const { user, supabase } = await getAuthenticatedUser();

  const profileStatus = await getProfileOnboardingStatus(supabase, user.id);
  if (profileStatus?.onboardingCompleted) {
    redirect("/collection");
  }

  const questions = await getActiveOnboardingQuestions(supabase);
  if (questions.length === 0) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground text-center text-sm">
          Onboarding is not configured yet. Please try again later.
        </p>
      </div>
    );
  }

  const optionGroups = await Promise.all(
    questions.map(async (question) => ({
      question,
      options: await getOnboardingOptionsForQuestion(supabase, question.id, { activeOnly: true }),
    })),
  );

  if (optionGroups.some((group) => group.options.length === 0)) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground text-center text-sm">
          Onboarding options are not available yet. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <OnboardingFlow steps={optionGroups} />
    </div>
  );
}
