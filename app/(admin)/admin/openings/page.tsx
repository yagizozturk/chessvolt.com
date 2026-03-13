import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminUser } from "@/lib/supabase/auth";
import { getAllOpeningVariants } from "@/features/openings/services/openings";
import { OpeningsList } from "./openings-list";

export default async function AdminOpeningsPage() {
  const { supabase } = await getAdminUser();
  const variants = await getAllOpeningVariants(supabase);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opening Variants</h1>
          <p className="text-muted-foreground text-sm">
            {variants.length} variant(s) listed
          </p>
        </div>
        <Link
          href="/admin/openings/new"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Variant
        </Link>
      </div>
      <OpeningsList variants={variants} />
    </div>
  );
}
