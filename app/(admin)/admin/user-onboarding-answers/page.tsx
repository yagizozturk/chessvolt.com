import { getAllUserOnboardingAnswersWithDetails } from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";
import { getAdminUser } from "@/lib/supabase/auth";

import { UserOnboardingAnswersList } from "./components/user-onboarding-answers-list";

const USER_ONBOARDING_ANSWER_ADMIN_ERRORS: Record<string, string> = {
  delete_failed: "Could not delete the answer. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminUserOnboardingAnswersPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const answers = await getAllUserOnboardingAnswersWithDetails(supabase);
  const { error } = await searchParams;
  const errorMessage = error ? (USER_ONBOARDING_ANSWER_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">User onboarding answers</h2>
          <p className="text-muted-foreground text-sm">{answers.length} saved answers · one per user per question</p>
        </div>
        <div className="mt-4">
          <UserOnboardingAnswersList answers={answers} />
        </div>
      </section>
    </div>
  );
}
