"use client";

import Image from "next/image";
import { useRepsStore } from "@/stores/reps-store";
import type { Repartoire } from "@/lib/model/reps";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RepsController({ rep }: { rep: Repartoire }) {
  const isRepsStarted = useRepsStore((state) => state.isRepsStarted);

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
        <div className="flex-1 gap-4 ml-4">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-lg border-border bg-muted/50">
                <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
                  <Image
                    src="/images/icons/icon-crown.png"
                    alt="Turn"
                    width={24}
                    height={24}
                  />
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <p className="font-semibold text-foreground">Test</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
