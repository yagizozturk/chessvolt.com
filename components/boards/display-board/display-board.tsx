"use client";

import { useEffect, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

type DisplayBoardProps = {
  sourceId: string;
  initialFen?: string;
  coordinates?: boolean;
  playerOrientation?: "white" | "black";
};

export default function DisplayBoard({
  sourceId,
  initialFen,
  coordinates = false,
  playerOrientation,
}: DisplayBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">(playerOrientation ?? getOrientationFromFen(initialFen));
  const { game } = useChessOne(initialFen);

  const { updateBoard } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly: true,
    coordinates,
    onMove: () => {},
  });

  useEffect(() => {
    orientationRef.current = playerOrientation ?? getOrientationFromFen(initialFen);
    updateBoard();
  }, [initialFen, playerOrientation, updateBoard]);

  return <div ref={boardRef} className="cardinal purple size-full" />;
}
