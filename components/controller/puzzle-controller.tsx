"use client";

import type { Puzzle } from "@/lib/model/puzzle";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";
import { getNextTurnFromFen } from "@/lib/chess-board/getTurn";
import { usePuzzleStore } from "@/stores/puzzle-store";

export default function PuzzleController({ puzzle }: { puzzle: Puzzle }) {
  const turnText = getNextTurnFromFen(puzzle.fen);

  return (
    <div className="flex">
      <div key={puzzle.id}>
        <PuzzleBoard
          puzzleId={puzzle.id}
          initialFen={puzzle.fen}
          moves={puzzle.moves}
          width={620}
          height={620}
          viewOnly={false}
        />
      </div>
      <div className="bg-secondary ml-4 flex-1 gap-4 rounded-xl">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      </div>
    </div>
  );
}
