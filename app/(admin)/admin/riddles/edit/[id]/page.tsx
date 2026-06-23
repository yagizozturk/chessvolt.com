import Link from "next/link";
import { notFound } from "next/navigation";

import { RiddleEditForm } from "@/app/(admin)/admin/riddles/components/riddle-edit-form";
import { getCollectionRiddlesByRiddleId } from "@/features/collection-riddles/services/collection-riddles.service";
import { getAllCollections } from "@/features/collection/services/collection.service";
import { getGameById } from "@/features/game/services/game.service";
import { getRiddleByIdWithThemes } from "@/features/riddle/services/riddle.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminRiddleEditPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await getAdminUser();
  const riddle = await getRiddleByIdWithThemes(supabase, id);

  if (!riddle) {
    notFound();
  }

  const [collections, collectionLinks, game] = await Promise.all([
    getAllCollections(supabase),
    getCollectionRiddlesByRiddleId(supabase, id),
    riddle.gameId ? getGameById(supabase, riddle.gameId) : null,
  ]);

  const initialPgn = (game?.pgn ?? riddle.moveSequence.pgn ?? "").trim();
  const collectionId = collectionLinks[0]?.collectionId ?? "";

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Link href={`/admin/riddles/${id}`} className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to riddle
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Edit riddle</h1>
      </div>
      <RiddleEditForm
        riddle={riddle}
        collections={collections}
        collectionId={collectionId}
        initialPgn={initialPgn}
      />
    </div>
  );
}
