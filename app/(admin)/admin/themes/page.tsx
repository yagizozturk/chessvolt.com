import { Plus } from "lucide-react";
import Link from "next/link";

import { ThemesList } from "@/app/(admin)/admin/themes/components/themes-list";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

const THEME_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  create_failed: "Could not create the theme. Please try again.",
  delete_failed: "Could not delete the theme. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminThemesPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const themes = await getAllThemes(supabase);
  const { error } = await searchParams;
  const errorMessage = error ? (THEME_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Themes</h2>
            <p className="text-muted-foreground text-sm">{themes.length} themes</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/themes/create"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New theme
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <ThemesList themes={themes} />
        </div>
      </section>
    </div>
  );
}
