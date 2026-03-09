"use client";

import Image from "next/image";
import { useRepsStore } from "@/stores/reps-store";
import type { Rep } from "@/lib/model/reps";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RepsController({ rep }: { rep: Rep }) {
  const isRepsStarted = useRepsStore((state) => state.isRepsStarted);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        {/* Left: Board */}
        <div key={rep.id}>
          <PuzzleBoard
            sourceId={rep.id}
            mode="riddle"
            pgn={rep.pgn ?? undefined}
            ply={rep.ply ?? 0}
            moves={rep.moves}
            width={620}
            height={620}
            viewOnly={false}
          />
        </div>

        {/* Right: Stats & Info */}
        {!isRepsStarted && (
          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
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
        )}
      </div>
    </div>
  );
}
