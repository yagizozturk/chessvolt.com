"use client";

import { useEffect, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

type DisplayBoardProps = {
  sourceId: string;
  initialFen?: string;
  size?: number;
  coordinates?: boolean;
  playerOrientation?: "white" | "black";
};

function getOrientationFromFen(fen?: string): "white" | "black" {
  const turn = fen?.trim().split(/\s+/)[1];
  return turn === "b" ? "black" : "white";
}

export default function DisplayBoard({
  sourceId,
  initialFen,
  size = 200,
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

  return <div ref={boardRef} className="cardinal green" style={{ width: size, height: size }} />;
}
