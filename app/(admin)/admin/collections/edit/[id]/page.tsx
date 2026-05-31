import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionEditForm } from "@/app/(admin)/admin/collections/components/collection-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionById } from "@/features/collection/services/collection.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminCollectionEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const collection = await getCollectionById(supabase, id);

  if (!collection) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/collections"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collections
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit collection</CardTitle>
          <CardDescription>{collection.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionEditForm collection={collection} />
        </CardContent>
      </Card>
    </div>
  );
}
