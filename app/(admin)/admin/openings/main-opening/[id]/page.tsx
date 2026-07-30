import { ArrowLeft, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getOpeningById, getOpeningVariantsByOpeningId } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";

import { OpeningVariantsList } from "../../variants/components/list/opening-variants-list";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminOpeningVariantsPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id: openingId } = await params;

  const [opening, variants] = await Promise.all([
    getOpeningById(supabase, openingId),
    getOpeningVariantsByOpeningId(supabase, openingId),
  ]);

  if (!opening) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/openings"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All openings
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/openings/variants/bulk"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <Upload className="h-4 w-4" />
            Bulk Variant Upload
          </Link>
          <Link
            href={`/admin/openings/variants/new?openingId=${encodeURIComponent(openingId)}`}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New variant
          </Link>
        </div>
      </div>

      <section>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">{opening.name}</h1>
          {opening.description ? <p className="text-muted-foreground mt-1 text-sm">{opening.description}</p> : null}
          <p className="text-muted-foreground mt-2 text-sm">{variants.length} variant(s)</p>
        </div>
        <OpeningVariantsList variants={variants} />
      </section>
    </div>
  );
}
