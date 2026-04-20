"use client";

import VoltBoardUpdated, {
  type VoltBoardFeedback,
  type VoltBoardMovePayload,
} from "@/components/volt-board-updated/volt-board-updated";
import { useOpeningVariantControllerUpdated } from "@/features/openings/hooks/use-opening-variant-controller-updated";
import type { MoveQuality } from "@/lib/utils/getMoveFeedbackClass";
import { useEffect, useState } from "react";

type OpeningVariantControllerUpdatedProps = {
  moves: string[];
};

function getMoveQuality(deltaCp: number | null): MoveQuality {
  if (deltaCp == null) return "good_move";
  if (deltaCp >= -20) return "best_move";
  if (deltaCp >= -100) return "good_move";
  if (deltaCp >= -250) return "inaccuracy";
  return "blunder";
}

export default function OpeningVariantControllerUpdated({
  moves,
}: OpeningVariantControllerUpdatedProps) {
  const { handleMovePlayed, moveCount, lastMoveEvaluation } =
    useOpeningVariantControllerUpdated(moves);
  const [feedback, setFeedback] = useState<VoltBoardFeedback | null>(null);

  function handleBoardMovePlayed(move: VoltBoardMovePayload) {
    const { isCorrect } = handleMovePlayed(move);

    console.log("move played:", move.uci);
    console.log("move count:", moveCount);
    console.log("is correct:", isCorrect);
  }

  useEffect(() => {
    if (!lastMoveEvaluation) return;
    const toSquare = lastMoveEvaluation.playedMove.slice(2, 4);
    const moveQuality = getMoveQuality(lastMoveEvaluation.deltaCp);

    setFeedback({
      to: toSquare,
      moveQuality,
    });

    console.log("move evaluation:", lastMoveEvaluation);
    console.log("before cp:", lastMoveEvaluation.beforeCp);
    console.log("after cp:", lastMoveEvaluation.afterCp);
    console.log("delta cp:", lastMoveEvaluation.deltaCp);
    console.log("move quality:", moveQuality);
  }, [lastMoveEvaluation]);

  return (
    <VoltBoardUpdated
      onMovePlayed={handleBoardMovePlayed}
      feedback={feedback}
    />
  );
}
