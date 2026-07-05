import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { OnboardingOptionThemeForm } from "@/app/(admin)/admin/onboarding-option-themes/components/onboarding-option-theme-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllOnboardingOptionsWithQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

const ONBOARDING_OPTION_THEME_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please select an option and a theme.",
  create_failed: "Could not create the link. This option may already be linked to that theme.",
};

type Props = {
  searchParams: Promise<{ error?: string; optionId?: string }>;
};

export default async function AdminCreateOnboardingOptionThemePage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const [options, themes] = await Promise.all([getAllOnboardingOptionsWithQuestion(supabase), getAllThemes(supabase)]);
  const { error, optionId } = await searchParams;
  const errorMessage = error ? (ONBOARDING_OPTION_THEME_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/onboarding-option-themes"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All option themes
      </Link>
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>New option–theme link</CardTitle>
          <CardDescription>
            When a user picks an onboarding answer, linked themes influence recommendations (see
            onboarding_option_themes in docs).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingOptionThemeForm options={options} themes={themes} defaultOptionId={optionId} />
        </CardContent>
      </Card>
    </div>
  );
}
