import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentThemeEditForm } from "@/app/(admin)/admin/content-themes/components/content-theme-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminThemeLinkByKindAndId } from "@/features/theme-link/services/theme-link-admin.service";
import { parseThemeLinkKind } from "@/features/theme-link/types/theme-link-kind";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ kind: string; id: string }>;
};

export default async function AdminThemeLinkEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { kind: kindRaw, id } = await params;
  const kind = parseThemeLinkKind(kindRaw);

  if (!kind) {
    notFound();
  }

  const item = await getAdminThemeLinkByKindAndId(supabase, kind, id);

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
        Back to theme links
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit theme link</CardTitle>
          <CardDescription>
            {item.theme.title} on {item.kind} {item.parentId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentThemeEditForm item={item} />
        </CardContent>
      </Card>
    </div>
  );
}
