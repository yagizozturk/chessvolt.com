import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { Plus, Upload } from "lucide-react";
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
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/openings/bulk"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Upload className="h-4 w-4" />
              Toplu Variant
            </Link>
            <Link
              href="/admin/openings/create"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New opening
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <MainOpenings openings={openings} />
        </div>
      </section>
    </div>
  );
}
