import RiddleController from "@/features/riddle/components/riddle-controller";
import { getRiddleById } from "@/features/riddle/services/riddle.service";
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
export default async function RiddlePage({ params }: Params) {
  const { supabase } = await getPublicUser();
  const { id } = await params;
  const riddle = await getRiddleById(supabase, id);

  if (!riddle || !riddle.isActive) {
    notFound();
  }

  return (
    <RiddleController
      riddle={riddle}
      parentChallengeUrl={
        riddle.gameType ? `/challenge/${riddle.gameType.replace(/_/g, "-")}` : "/"
      }
    />
  );
}
