import { getGameRiddleById } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game/service/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";
import RiddleController from "@/features/game-riddle/components/riddle-controller";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function GameRiddlePage({ params }: Params) {
  const { supabase } = await getAuthenticatedUser();
  const { id } = await params;
  const riddle = await getGameRiddleById(supabase, id);

  if (!riddle) {
    notFound();
  }

  const game = await getGameById(supabase, riddle.gameId);

  if (!game) {
    notFound();
  }

  return <RiddleController riddle={riddle} game={game} />;
}
