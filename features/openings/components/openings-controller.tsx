"use client";

import { Card, CardHeader } from "@/components/ui/card";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import { useRouter } from "next/navigation";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";

export default function OpeningsController({
  variant,
}: {
  variant: OpeningVariant;
}) {
  const router = useRouter();
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();

  const handleSolved = async (isCorrect: boolean) => {
    await updateOpeningVariantAnswerHook(variant.id, isCorrect);
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
            mode="repertoire"
            initialFen={variant.initialFen ?? undefined}
            moves={variant.moves}
            width={620}
            height={620}
            viewOnly={false}
            onSolved={handleSolved}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
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
    </div>
  );
}
