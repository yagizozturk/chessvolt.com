import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { VariantForm } from "../components/form/variant-form";

type Props = {
  searchParams: Promise<{ openingId?: string }>;
};

export default async function AdminOpeningsNewPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const openings = await getAllOpenings(supabase);
  const { openingId } = await searchParams;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/openings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New Opening Variant</CardTitle>
          <CardDescription>
            Add a new variant to an opening. Requires an existing opening.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {openings.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No openings found. Create openings first in the database.
            </p>
          ) : (
            <VariantForm openings={openings} defaultOpeningId={openingId} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
