import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

import { VariantForm } from "../variant-form";

export default async function AdminOpeningsNewPage() {
  const { supabase } = await getAdminUser();
  const openings = await getAllOpenings(supabase);

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
          <CardAction>
            <Link
              href="/admin/openings/bulk"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Upload className="h-4 w-4" />
              Toplu Variant Gir
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          {openings.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No openings found. Create openings first in the database.
            </p>
          ) : (
            <VariantForm openings={openings} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
