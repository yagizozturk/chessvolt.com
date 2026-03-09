"use client";

import { useRouter } from "next/navigation";
import { useRepsStore } from "@/stores/reps-store";
import type { Rep } from "@/lib/model/reps";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";
import { Card, CardHeader } from "@/components/ui/card";

export default function RepsController({ rep }: { rep: Rep }) {
  const router = useRouter();
  const isRepsStarted = useRepsStore((state) => state.isRepsStarted);

  const handleSolved = (isCorrect: boolean) => {
    if (isCorrect) {
      router.push("/reps");
    }
  };

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
            onSolved={handleSolved}
          />
        </div>

        {/* Right: Stats & Info */}
        {!isRepsStarted && (
          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Card className="border-border bg-muted/50 rounded-lg">
                <CardHeader className="p-4 pb-2">
                  <p className="text-foreground font-semibold">
                    {rep.title || "Untitled Repertoire"}
                  </p>
                  {rep.openingName && (
                    <p className="text-muted-foreground text-sm">
                      {rep.openingName}
                    </p>
                  )}
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
