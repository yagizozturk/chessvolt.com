import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StudyContentThemesSection } from "@/app/(admin)/admin/studies/components/study-content-themes-section";
import { StudyEditForm } from "@/app/(admin)/admin/studies/components/study-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudyThemesForStudyWithTheme } from "@/features/study-theme/services/study-theme.service";
import { getStudyById } from "@/features/study/services/study.service";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

const STUDY_THEME_ERRORS: Record<string, string> = {
  missing_fields: "Please select a theme and try again.",
  create_failed: "Could not add the theme. It may already be linked to this study, or the theme no longer exists.",
  update_failed: "Could not save the weight. Please try again.",
  delete_failed: "Could not remove the theme link. Please try again.",
};

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ themes_error?: string }>;
};

export default async function AdminStudyEditPage({ params, searchParams }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const { themes_error: themesError } = await searchParams;

  const [study, linkedThemes, themes] = await Promise.all([
    getStudyById(supabase, id),
    getStudyThemesForStudyWithTheme(supabase, id),
    getAllThemes(supabase),
  ]);

  if (!study) {
    notFound();
  }

  const themesErrorMessage = themesError
    ? (STUDY_THEME_ERRORS[themesError] ?? `An error occurred (${themesError}).`)
    : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/studies"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to studies
      </Link>
      {themesErrorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {themesErrorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Edit study</CardTitle>
          <CardDescription>{study.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <StudyEditForm study={study} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Themes</CardTitle>
          <CardDescription>
            Link themes to this study. Higher weights appear on study cards (top two).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudyContentThemesSection studyId={study.id} linkedThemes={linkedThemes} themes={themes} />
        </CardContent>
      </Card>
    </div>
  );
}
