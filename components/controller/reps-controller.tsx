"use client";

import { useRepsStore } from "@/stores/reps-store";
import StatsItem from "../stats-item/stats-item";
import type { Repartoire } from "@/lib/model/reps";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";

export default function RepsController({ rep }: {rep: Repartoire}) {
  const isRepsStarted = useRepsStore((state) => state.isRepsStarted);
  const setIsRepsStarted = useRepsStore((state) => state.setIsRepsStarted);

  return (
    <div className="flex">
      <div key={rep.id}>
        <PuzzleBoard
          puzzleId={rep.id}
          initialFen={rep.fen}
          moves={rep.moves}
          width={620}
          height={620}
          viewOnly={false}
        />
      </div>
      {!isRepsStarted && (
        <div className="flex-1 gap-4 ml-4 bg-primary rounded-lg">
     
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <StatsItem
                iconSrc="/images/icons/icon-crown.png"
                iconAlt="Turn"
                text={"Test"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
