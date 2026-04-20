"use client";

import VoltBoardUpdated, {
  type VoltBoardFeedback,
} from "@/components/volt-board-updated/volt-board-updated";
import { useOpeningVariantControllerUpdated } from "@/features/openings/hooks/use-opening-variant-controller-updated";
import { useState } from "react";

type OpeningVariantControllerUpdatedProps = {
  moves: string[];
};

export default function OpeningVariantControllerUpdated({
  moves,
}: OpeningVariantControllerUpdatedProps) {
  const { handleMovePlayed, moveCount } =
    useOpeningVariantControllerUpdated(moves);
  const [feedback, setFeedback] = useState<VoltBoardFeedback | null>(null);

  function handleBoardMovePlayed(uci: string) {
    const { isCorrect } = handleMovePlayed(uci);
    const toSquare = uci.slice(2, 4);

    setFeedback({
      to: toSquare,
      isCorrect,
    });

    console.log("move played:", uci);
    console.log("move count:", moveCount);
    console.log("is correct:", isCorrect);
  }

  return <VoltBoardUpdated onMovePlayed={handleBoardMovePlayed} feedback={feedback} />;
}
