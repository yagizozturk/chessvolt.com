import { Plus } from "lucide-react";
import Link from "next/link";

import { RiddlesList } from "@/app/(admin)/admin/riddles/components/riddles-list";
import { getAllRiddlesWithThemes } from "@/features/riddle/services/riddle.service";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function AdminRiddlesPage() {
  const { supabase } = await getAdminUser();
  const riddles = await getAllRiddlesWithThemes(supabase);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Riddles</h2>
            <p className="text-muted-foreground text-sm">{riddles.length} riddles</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/riddles/new/pgn-ply"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              PGN + ply
            </Link>
            <Link
              href="/admin/riddles/new/from-game"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              From game
            </Link>
            <Link
              href="/admin/riddles/new/bulk"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Bulk PGN
            </Link>
            <Link
              href="/admin/riddles/new/lichess"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Lichess CSV
            </Link>
          </div>
        </div>
        <RiddlesList riddles={riddles} />
      </section>
    </div>
  );
}
