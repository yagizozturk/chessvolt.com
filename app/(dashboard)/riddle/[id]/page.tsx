import { notFound } from "next/navigation";

import RiddleController from "@/features/riddle/components/riddle-controller";
import { getRiddleById, getRiddlesByGameType } from "@/features/riddle/services/riddle.service";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function RiddlePage({ params }: Params) {
  const { supabase } = await getPublicUser();
  const { id } = await params;
  const riddle = await getRiddleById(supabase, id);

  if (!riddle || !riddle.isActive) {
    notFound();
  }

  // ======================================================================
  // Get all riddles for this challenge (game type)
  // Get the next riddle if it exists
  // ======================================================================
  const riddles = riddle.gameType
    ? await getRiddlesByGameType(supabase, riddle.gameType, { activeOnly: true })
    : [];

  const currentIndex = riddles.findIndex((r) => r.id === riddle.id);
  const nextRiddle =
    currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;

  const parentChallengeUrl = riddle.gameType
    ? `/challenge/${riddle.gameType.replace(/_/g, "-")}`
    : "/";

  return (
    <RiddleController
      riddle={riddle}
      nextRiddleId={nextRiddle?.id ?? null}
      parentChallengeUrl={parentChallengeUrl}
    />
  );
}
