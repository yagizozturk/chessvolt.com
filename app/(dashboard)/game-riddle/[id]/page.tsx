import RiddleController from "@/features/game-riddle/components/riddle-controller";
import { getGameRiddleById } from "@/features/game-riddle/services/game-riddle.service";
import { getGameById } from "@/features/game/services/game.service";
import { getPublicUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

/**
 * Fonksyon Bilgisi ✅
 * 1. İlgili riddle id ye göre çekilir
 * 2. İlgili game id ye göre çekilir
 * 3. RiddleController a verilir riddle ve game
 */
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
