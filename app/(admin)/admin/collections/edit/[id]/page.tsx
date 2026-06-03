import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionContentThemesSection } from "@/app/(admin)/admin/collections/components/collection-content-themes-section";
import { CollectionEditForm } from "@/app/(admin)/admin/collections/components/collection-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionById } from "@/features/collection/services/collection.service";
import { getContentThemesForContentWithTheme } from "@/features/content-theme/services/content-theme.service";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

const COLLECTION_THEME_ERRORS: Record<string, string> = {
  missing_fields: "Please select a theme and try again.",
  create_failed:
    "Could not add the theme. It may already be linked to this collection, or the theme no longer exists.",
  update_failed: "Could not save the weight. Please try again.",
  delete_failed: "Could not remove the theme link. Please try again.",
};

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ themes_error?: string }>;
};

export default async function AdminCollectionEditPage({ params, searchParams }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const { themes_error: themesError } = await searchParams;

  const [collection, linkedThemes, themes] = await Promise.all([
    getCollectionById(supabase, id),
    getContentThemesForContentWithTheme(supabase, "collection", id),
    getAllThemes(supabase),
  ]);

  if (!collection) {
    notFound();
  }

  const themesErrorMessage = themesError
    ? (COLLECTION_THEME_ERRORS[themesError] ?? `An error occurred (${themesError}).`)
    : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/collections"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collections
      </Link>
      {themesErrorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {themesErrorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Edit collection</CardTitle>
          <CardDescription>{collection.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionEditForm collection={collection} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Themes</CardTitle>
          <CardDescription>
            Link themes to this collection. Higher weights appear on collection cards (top two).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionContentThemesSection
            collectionId={collection.id}
            linkedThemes={linkedThemes}
            themes={themes}
          />
        </CardContent>
      </Card>
    </div>
  );
}
