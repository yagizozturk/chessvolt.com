import { getRiddleById } from "@/features/riddle/services/riddle.service";
import { getGameById } from "@/features/game/services/game.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

import { RiddleDetail } from "../riddle-detail";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminRiddleDetailPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;

  const riddle = await getRiddleById(supabase, id);
  if (!riddle) {
    notFound();
  }

  const game = await getGameById(supabase, riddle.gameId);

  return (
    <div className="container mx-auto px-4 py-8">
      <RiddleDetail riddle={riddle} game={game} />
    </div>
  );
}
