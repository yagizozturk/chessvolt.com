import Link from "next/link";

import { BulkPgnCreateForm } from "@/app/(admin)/admin/riddles/components/bulk-pgn-create-form";
import { getAllCollections } from "@/features/collection/services/collection.service";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function NewBulkRiddlePage() {
  const { supabase } = await getAdminUser();
  const collections = await getAllCollections(supabase);

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/riddles" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to riddles
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Bulk create — PGN text</h1>
      </div>
      <BulkPgnCreateForm collections={collections} />
    </div>
  );
}
