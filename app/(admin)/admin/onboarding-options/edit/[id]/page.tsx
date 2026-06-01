import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OnboardingOptionEditForm } from "@/app/(admin)/admin/onboarding-options/components/onboarding-option-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingOptionByIdWithQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getAllOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminOnboardingOptionEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const [option, questions] = await Promise.all([
    getOnboardingOptionByIdWithQuestion(supabase, id),
    getAllOnboardingQuestions(supabase),
  ]);

  if (!option) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/onboarding-options"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to onboarding options
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit onboarding option</CardTitle>
          <CardDescription>
            {option.label} · {option.question.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingOptionEditForm option={option} questions={questions} />
        </CardContent>
      </Card>
    </div>
  );
}
