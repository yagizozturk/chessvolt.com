import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OnboardingOptionThemeEditForm } from "@/app/(admin)/admin/onboarding-option-themes/components/onboarding-option-theme-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOnboardingOptionThemeByIdWithDetails } from "@/features/onboarding-option-theme/services/onboarding-option-theme.service";
import { getAllOnboardingOptionsWithQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminOnboardingOptionThemeEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const [item, options, themes] = await Promise.all([
    getOnboardingOptionThemeByIdWithDetails(supabase, id),
    getAllOnboardingOptionsWithQuestion(supabase),
    getAllThemes(supabase),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/onboarding-option-themes"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to option themes
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit option–theme link</CardTitle>
          <CardDescription>
            {item.option.label} → {item.theme.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingOptionThemeEditForm item={item} options={options} themes={themes} />
        </CardContent>
      </Card>
    </div>
  );
}
