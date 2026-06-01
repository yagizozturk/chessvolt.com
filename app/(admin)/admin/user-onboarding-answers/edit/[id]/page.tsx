import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { UserOnboardingAnswerEditForm } from "@/app/(admin)/admin/user-onboarding-answers/components/user-onboarding-answer-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingOptionsForQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getUserOnboardingAnswerByIdWithDetails } from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserOnboardingAnswerEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const answer = await getUserOnboardingAnswerByIdWithDetails(supabase, id);

  if (!answer) {
    notFound();
  }

  const optionsForQuestion = await getOnboardingOptionsForQuestion(supabase, answer.questionId);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/user-onboarding-answers"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to user answers
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit user onboarding answer</CardTitle>
          <CardDescription>
            {answer.question.title} · {answer.option.label}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserOnboardingAnswerEditForm answer={answer} optionsForQuestion={optionsForQuestion} />
        </CardContent>
      </Card>
    </div>
  );
}
