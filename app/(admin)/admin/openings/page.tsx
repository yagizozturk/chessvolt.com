import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";

import { MainOpenings } from "./components/lists/parent-openings-list";

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
        </div>
        <div className="mt-4">
          <MainOpenings openings={openings} />
        </div>
      </section>
    </div>
  );
}
