import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOpeningById } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OpeningEditForm } from "../../opening-edit-form";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminOpeningEditPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const opening = await getOpeningById(supabase, id);

  if (!opening) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/openings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Openings
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit Opening</CardTitle>
          <CardDescription>{opening.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <OpeningEditForm opening={opening} />
        </CardContent>
      </Card>
    </div>
  );
}
