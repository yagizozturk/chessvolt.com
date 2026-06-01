import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentThemeEditForm } from "@/app/(admin)/admin/content-themes/components/content-theme-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContentThemeByIdWithTheme } from "@/features/content-theme/services/content-theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminContentThemeEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const item = await getContentThemeByIdWithTheme(supabase, id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/content-themes"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to content themes
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit content–theme link</CardTitle>
          <CardDescription>
            {item.theme.title} on {item.contentType} {item.contentId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentThemeEditForm item={item} />
        </CardContent>
      </Card>
    </div>
  );
}
