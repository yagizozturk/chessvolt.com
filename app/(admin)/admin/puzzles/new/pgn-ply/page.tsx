import Link from "next/link";

import { PlyPgnCreateForm } from "@/app/(admin)/admin/puzzles/components/ply-pgn-create-form";
import { getAllStudies } from "@/features/study/services/study.service";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function NewPgnPlyPuzzlePage() {
  const { supabase } = await getAdminUser();
  const studies = await getAllStudies(supabase);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/puzzles" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to puzzles
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New puzzle — PGN + ply</h1>
      </div>
      <PlyPgnCreateForm studies={studies} />
    </div>
  );
}
