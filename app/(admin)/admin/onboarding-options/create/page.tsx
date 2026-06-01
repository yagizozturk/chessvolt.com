import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { OnboardingOptionForm } from "@/app/(admin)/admin/onboarding-options/components/onboarding-option-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import { getAdminUser } from "@/lib/supabase/auth";

const ONBOARDING_OPTION_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  invalid_rating: "Initial rating must be 100–3000 and deviation must be 50–500.",
  create_failed: "Could not create the option. Check that value is unique for this question.",
};

type Props = {
  searchParams: Promise<{ error?: string; questionId?: string }>;
};

export default async function AdminCreateOnboardingOptionPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const questions = await getAllOnboardingQuestions(supabase);
  const { error, questionId } = await searchParams;
  const errorMessage = error ? (ONBOARDING_OPTION_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/onboarding-options"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All onboarding options
      </Link>
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>New onboarding option</CardTitle>
          <CardDescription>
            Answer choices for an onboarding question. Value is stored internally; label is shown to users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingOptionForm questions={questions} defaultQuestionId={questionId} />
        </CardContent>
      </Card>
    </div>
  );
}
