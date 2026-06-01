import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ThemeEditForm } from "@/app/(admin)/admin/themes/components/theme-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getThemeById } from "@/features/theme/services/theme.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminThemeEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const theme = await getThemeById(supabase, id);

  if (!theme) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/themes"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to themes
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit theme</CardTitle>
          <CardDescription>{theme.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeEditForm theme={theme} />
        </CardContent>
      </Card>
    </div>
  );
}
