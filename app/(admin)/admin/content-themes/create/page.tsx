import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ContentThemeForm } from "@/app/(admin)/admin/content-themes/components/content-theme-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

const CONTENT_THEME_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  create_failed: "Could not create the link. Check that the content exists and this theme is not already linked.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminCreateContentThemePage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const themes = await getAllThemes(supabase);
  const { error } = await searchParams;
  const errorMessage = error ? (CONTENT_THEME_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/content-themes"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All content themes
      </Link>
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>New content–theme link</CardTitle>
          <CardDescription>
            Attach a theme to a piece of content with a weight (1–10). Primary themes use 10; context themes use 2–5.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentThemeForm themes={themes} />
        </CardContent>
      </Card>
    </div>
  );
}
