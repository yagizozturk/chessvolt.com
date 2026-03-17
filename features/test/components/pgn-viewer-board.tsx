"use client";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { Chessground } from "@lichess-org/chessground";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import type { Key } from "@lichess-org/chessground/types";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utilities/cn";

type PgnViewerBoardProps = {
  fen: string;
  lastMove?: [string, string] | null;
  width?: number;
  height?: number;
  className?: string;
};

export function PgnViewerBoard({
  fen,
  lastMove,
  width = 400,
  height = 400,
  className,
}: PgnViewerBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    if (ground.current) ground.current.destroy();

    const lastMoveTuple: [Key, Key] | undefined =
      lastMove && lastMove.length === 2
        ? [lastMove[0] as Key, lastMove[1] as Key]
        : undefined;

    ground.current = Chessground(boardRef.current, {
      fen,
      orientation: "white",
      viewOnly: true,
      lastMove: lastMoveTuple,
    });

    return () => {
      ground.current?.destroy();
      ground.current = null;
    };
  }, [fen, lastMove]);

  return (
    <div className={cn("w-fit", className)}>
      <div
        ref={boardRef}
        className="cardinal blue"
        style={{ width, height }}
      />
    </div>
  );
}
