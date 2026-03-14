"use client";

import { useRouter } from "next/navigation";
import { useOpeningsStore } from "@/features/openings/store/openings-store";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import { Card, CardHeader } from "@/components/ui/card";

export default function OpeningsController({
  variant,
}: {
  variant: OpeningVariant;
}) {
  const router = useRouter();
  const isStarted = useOpeningsStore((state) => state.isStarted);

  const handleSolved = (isCorrect: boolean) => {
    if (isCorrect) {
      router.push("/openings");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        <div key={variant.id}>
          <PuzzleBoard
            sourceId={variant.id}
            mode="riddle"
            initialFen={variant.fen ?? undefined}
            moves={variant.moves}
            width={620}
            height={620}
            viewOnly={false}
            onSolved={handleSolved}
          />
        </div>

        {!isStarted && (
          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Card className="border-border bg-muted/50 rounded-lg">
                <CardHeader className="p-4 pb-2">
                  <p className="text-foreground font-semibold">
                    {variant.title || "Untitled Variant"}
                  </p>
                  {variant.ecoCode && (
                    <p className="text-muted-foreground text-sm">
                      {variant.ecoCode}
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
