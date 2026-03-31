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

import { JsonVariantForm } from "../components/form/json-variant-form";

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
          <CardTitle>New Opening Variant (JSON)</CardTitle>
          <CardDescription>
            Paste variant JSON (with <code className="text-xs">pgn</code>), pick
            boards for <code className="text-xs">initial_fen</code> /{" "}
            <code className="text-xs">display_fen</code>, then submit to save.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {openings.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No openings found. Create openings first in the database.
            </p>
          ) : (
            <JsonVariantForm openings={openings} defaultOpeningId={openingId} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
