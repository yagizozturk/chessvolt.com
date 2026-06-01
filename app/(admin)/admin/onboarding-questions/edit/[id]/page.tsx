import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OnboardingQuestionEditForm } from "@/app/(admin)/admin/onboarding-questions/components/onboarding-question-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingQuestionById } from "@/features/onboarding-question/services/onboarding-question.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminOnboardingQuestionEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const question = await getOnboardingQuestionById(supabase, id);

  if (!question) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/onboarding-questions"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to onboarding questions
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit onboarding question</CardTitle>
          <CardDescription>{question.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingQuestionEditForm question={question} />
        </CardContent>
      </Card>
    </div>
  );
}
