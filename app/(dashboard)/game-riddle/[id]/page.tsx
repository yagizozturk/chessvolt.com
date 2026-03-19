import RiddleController from "@/features/game-riddle/components/riddle-controller";
import { getGameRiddleById } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game/services/game";
import { getPublicUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function GameRiddlePage({ params }: Params) {
  const { supabase } = await getPublicUser();
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
