import Link from "next/link";

import { PlyPgnCreateForm } from "@/app/(admin)/admin/riddles/components/ply-pgn-create-form";
import { getAllCollections } from "@/features/collection/services/collection.service";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function NewPgnPlyRiddlePage() {
  const { supabase } = await getAdminUser();
  const collections = await getAllCollections(supabase);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/riddles" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to riddles
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New riddle — PGN + ply</h1>
      </div>
      <PlyPgnCreateForm collections={collections} />
    </div>
  );
}
