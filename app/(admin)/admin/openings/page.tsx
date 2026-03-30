import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { Plus } from "lucide-react";
import Link from "next/link";

import { MainOpenings } from "./components/lists/main-openings-list";

export default async function AdminOpeningsPage() {
  const { supabase } = await getAdminUser();
  const openings = await getAllOpenings(supabase);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Openings</h2>
            <p className="text-muted-foreground text-sm">
              {openings.length} openings
            </p>
          </div>
          <Link
            href="/admin/openings/create"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New opening
          </Link>
        </div>
        <div className="mt-4">
          <MainOpenings openings={openings} />
        </div>
      </section>
    </div>
  );
}
