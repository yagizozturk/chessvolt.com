import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { OnboardingQuestionForm } from "@/app/(admin)/admin/onboarding-questions/components/onboarding-question-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ONBOARDING_QUESTION_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  create_failed: "Could not create the question. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminCreateOnboardingQuestionPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMessage = error ? (ONBOARDING_QUESTION_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/onboarding-questions"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All onboarding questions
      </Link>
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>New onboarding question</CardTitle>
          <CardDescription>
            Questions are shown to new users in sort order. Options can be linked via onboarding options (separate
            table).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingQuestionForm />
        </CardContent>
      </Card>
    </div>
  );
}
