import { Plus } from "lucide-react";
import Link from "next/link";

import { ContentThemesList } from "@/app/(admin)/admin/content-themes/components/content-themes-list";
import { getAllAdminThemeLinks } from "@/features/theme-link/services/theme-link-admin.service";
import { getAdminUser } from "@/lib/supabase/auth";

const THEME_LINK_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  create_failed: "Could not create the link. Check that the content exists and this theme is not already linked.",
  delete_failed: "Could not delete the link. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminContentThemesPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const items = await getAllAdminThemeLinks(supabase);
  const { error } = await searchParams;
  const errorMessage = error ? (THEME_LINK_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

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
            <h2 className="text-xl font-bold tracking-tight">Theme links</h2>
            <p className="text-muted-foreground text-sm">{items.length} links between content and themes</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/content-themes/create"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New link
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <ContentThemesList items={items} />
        </div>
      </section>
    </div>
  );
}
