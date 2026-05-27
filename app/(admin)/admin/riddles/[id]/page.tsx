import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminFormErrorAlert } from "@/app/(admin)/admin/shared/components/admin-form-error-alert";
import { Button } from "@/components/ui/button";
import { getGameById } from "@/features/game/services/game.service";
import { getRiddleById } from "@/features/riddle/services/riddle.service";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { getAdminUser } from "@/lib/supabase/auth";

import { RiddleEditForm } from "../edit/riddle-edit-form";

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminRiddleDetailPage({ params, searchParams }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const { error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  const riddle = await getRiddleById(supabase, id);
  if (!riddle) {
    notFound();
  }

  const game = riddle.gameId ? await getGameById(supabase, riddle.gameId) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/riddles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>
      <AdminFormErrorAlert message={errorMessage} />
      <RiddleEditForm riddle={riddle} game={game} />
    </div>
  );
}
