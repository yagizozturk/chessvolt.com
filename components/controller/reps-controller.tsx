"use client";

import Image from "next/image";
import { useRepsStore } from "@/stores/reps-store";
import type { Rep } from "@/lib/model/reps";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RepsController({ rep }: { rep: Rep }) {
  const isRepsStarted = useRepsStore((state) => state.isRepsStarted);

  return (
    <div className="flex">
      <div key={rep.id}>
        <PuzzleBoard
          sourceId={rep.id}
          mode="puzzle"
          initialFen={rep.fen ?? undefined}
          moves={rep.moves}
          width={620}
          height={620}
          viewOnly={false}
        />
      </div>
      {!isRepsStarted && (
        <div className="ml-4 flex-1 gap-4">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border bg-muted/50 rounded-lg">
                <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
                  <Image
                    src="/images/icons/icon-crown.png"
                    alt="Turn"
                    width={24}
                    height={24}
                  />
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <p className="text-foreground font-semibold">Test</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
