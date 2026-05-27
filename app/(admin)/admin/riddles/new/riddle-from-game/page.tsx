import { AdminFormErrorAlert } from "@/app/(admin)/admin/shared/components/admin-form-error-alert";
import * as gameRepo from "@/features/game/repository/game.repository";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { getAdminUser } from "@/lib/supabase/auth";

import { RiddleFromGameForm } from "./riddle-from-game-form";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminRiddleFromGamePage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const games = await gameRepo.findAll(supabase);
  const { error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <AdminFormErrorAlert message={errorMessage} />
      <RiddleFromGameForm games={games} />
    </div>
  );
}
