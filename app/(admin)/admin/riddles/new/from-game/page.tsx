import Link from "next/link";

import { FromGameCreateForm } from "@/app/(admin)/admin/riddles/components/from-game-create-form";
import { getAllCollections } from "@/features/collection/services/collection.service";
import { getAllGames } from "@/features/game/services/game.service";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function NewFromGameRiddlePage() {
  const { supabase } = await getAdminUser();
  const [collections, games] = await Promise.all([
    getAllCollections(supabase),
    getAllGames(supabase),
  ]);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/riddles" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to riddles
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New riddle — from game</h1>
      </div>
      <FromGameCreateForm collections={collections} games={games} />
    </div>
  );
}
