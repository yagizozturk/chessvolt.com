import Link from "next/link";

import { BulkPgnCreateForm } from "@/app/(admin)/admin/puzzles/components/bulk-pgn-create-form";
import { getAllStudies } from "@/features/study/services/study.service";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function NewBulkPuzzlePage() {
  const { supabase } = await getAdminUser();
  const studies = await getAllStudies(supabase);

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/puzzles" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to puzzles
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Bulk create — PGN text</h1>
      </div>
      <BulkPgnCreateForm studies={studies} />
    </div>
  );
}
