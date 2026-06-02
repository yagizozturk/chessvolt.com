import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import { getOnboardingOptionsForQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getOnboardingQuestionBySlug } from "@/features/onboarding-question/services/onboarding-question.service";
import { getProfileOnboardingStatus } from "@/features/profile/repository/profile.repository";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function OnboardingPage() {
  const { user, supabase } = await getAuthenticatedUser();

  const profileStatus = await getProfileOnboardingStatus(supabase, user.id);
  if (profileStatus?.onboardingCompleted) {
    redirect("/collection");
  }

  const [chessQuestion, improvementQuestion] = await Promise.all([
    getOnboardingQuestionBySlug(supabase, ONBOARDING_QUESTION_SLUG.chessFamiliarity),
    getOnboardingQuestionBySlug(supabase, ONBOARDING_QUESTION_SLUG.improvementGoal),
  ]);

  if (!chessQuestion?.isActive || !improvementQuestion?.isActive) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-muted-foreground text-center text-sm">
          Onboarding is not configured yet. Please try again later.
        </p>
      </div>
    );
  }

  const [chessOptions, improvementOptions] = await Promise.all([
    getOnboardingOptionsForQuestion(supabase, chessQuestion.id, { activeOnly: true }),
    getOnboardingOptionsForQuestion(supabase, improvementQuestion.id, { activeOnly: true }),
  ]);

  if (chessOptions.length === 0 || improvementOptions.length === 0) {
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
      <OnboardingFlow
        chessFamiliarity={{ question: chessQuestion, options: chessOptions }}
        improvementGoal={{ question: improvementQuestion, options: improvementOptions }}
      />
    </div>
  );
}
