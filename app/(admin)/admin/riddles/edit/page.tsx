import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminFormErrorAlert } from "@/app/(admin)/admin/shared/components/admin-form-error-alert";
import { Button } from "@/components/ui/button";
import { getAllCollections } from "@/features/collection/services/collection.service";
import { getGameById } from "@/features/game/services/game.service";
import { getRiddleCollectionsForRiddle } from "@/features/riddle-collection/services/riddle-collection.service";
import { getRiddleByIdWithThemes } from "@/features/riddle/services/riddle.service";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { getAdminUser } from "@/lib/supabase/auth";

import { RiddleEditForm } from "./riddle-edit-form";

type Props = {
  searchParams: Promise<{ id?: string; error?: string }>;
};

export default async function AdminRiddleEditPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const { id, error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  if (!id?.trim()) {
    notFound();
  }

  const riddle = await getRiddleByIdWithThemes(supabase, id);
  if (!riddle) {
    notFound();
  }

  const game = riddle.gameId ? await getGameById(supabase, riddle.gameId) : null;
  const [collections, riddleCollections] = await Promise.all([
    getAllCollections(supabase),
    getRiddleCollectionsForRiddle(supabase, id),
  ]);
  const collectionId = riddleCollections[0]?.collectionId ?? collections[0]?.id ?? "";

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/riddles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>
      <AdminFormErrorAlert message={errorMessage} />
      <RiddleEditForm riddle={riddle} game={game} collections={collections} collectionId={collectionId} />
    </div>
  );
}
