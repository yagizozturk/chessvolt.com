import { getAdminUser } from "@/lib/supabase/auth";
import { getGameRiddleById } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game-riddle/services/game";
import { notFound } from "next/navigation";
import { GameRiddleDetail } from "../game-riddle-detail";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminGameRiddleDetailPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;

  const riddle = await getGameRiddleById(supabase, id);
  if (!riddle) {
    notFound();
  }

  const game = await getGameById(supabase, riddle.gameId);

  return (
    <div className="container mx-auto px-4 py-8">
      <GameRiddleDetail riddle={riddle} game={game} />
    </div>
  );
}
