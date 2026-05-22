"use client";

import type { Riddle } from "@/features/riddle/types/riddle";
import { useMoveSequenceController } from "@/lib/shared/hooks/move-sequence/use-move-sequence-controller";
import { getRiddlePlayable } from "@/lib/shared/utilities/move-sequence-playable";

type UseRiddleControllerParams = {
  riddle: Riddle;
};

export function useRiddleController({ riddle }: UseRiddleControllerParams) {
  const playable = getRiddlePlayable(riddle);

  return useMoveSequenceController({
    sourceId: playable.sourceId,
    moves: playable.moves,
    goals: playable.goals,
  });
}
