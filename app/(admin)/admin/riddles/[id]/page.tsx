import { getRiddleById } from "@/features/riddle/services/riddle.service";
import { getGameById } from "@/features/game/services/game.service";
import { AdminFormErrorAlert } from "@/features/admin/components/admin-form-error-alert";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { getAdminUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

import { RiddleDetail } from "../riddle-detail";

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

  const game = await getGameById(supabase, riddle.gameId);

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminFormErrorAlert message={errorMessage} />
      <RiddleDetail riddle={riddle} game={game} />
    </div>
  );
}
