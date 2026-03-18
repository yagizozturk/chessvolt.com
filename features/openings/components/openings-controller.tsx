"use client";

import { Card, CardHeader } from "@/components/ui/card";
import VoltBoard from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { useRouter } from "next/navigation";

export default function OpeningsController({
  variant,
  nextVariantId,
  returnUrl = "/openings",
}: {
  variant: OpeningVariant;
  nextVariantId?: string | null;
  returnUrl?: string;
}) {
  const router = useRouter();
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();

  // ======================================================================
  // If there is another unsolved variant, go to that page
  // If all the variants are solved, return to main opening page
  // ======================================================================
  const handleSolved = async (isCorrect: boolean) => {
    await updateOpeningVariantAnswerHook(variant.id, isCorrect);
    if (isCorrect) {
      if (nextVariantId) {
        router.push(`/openings/variant/${nextVariantId}`);
      } else {
        router.push(returnUrl);
      }
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        <div key={variant.id}>
          <VoltBoard
            sourceId={variant.id}
            mode="opening"
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
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
