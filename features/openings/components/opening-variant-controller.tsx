"use client";

import ImageInformationCard from "@/components/cards/image-information-card";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { VoltButton } from "@/components/ui/volt-button";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useOpeningVariantController } from "@/features/openings/hooks/use-opening-variant-controller";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { useEffect, useRef } from "react";

type OpeningVariantControllerProps = {
  variant: OpeningVariant;
  siblingVariants: OpeningVariant[];
  nextVariantId: string | null;
  parentOpeningUrl: string;
};

/**
 * Fonksyon Açıklaması
 * Props alır ve Variant ın oynanacağı ekranı gçösterir. VoltBoard içerir
 * variant: variant ın kendisini alır
 * siblingVariants: Aynı opening altındaki tüm varyantlar (sıralı); varyant-slider için.
 * nextVariantId: Sonraki variant ın id si; next-variant butonu için.
 * parentOpeningUrl: Opening ana sayfasının URL si; variant olarak sona geldiğinde ana opening sayfası için
 */
export default function OpeningVariantController({
  variant,
  siblingVariants,
  nextVariantId,
  parentOpeningUrl,
}: OpeningVariantControllerProps) {
  const boardRef = useRef<VoltBoardHandle>(null);
  const confettiRef = useRef<ConfettiRef>(null);
  const {
    handleFenAfterOpponentMove,
    handleFenAfterUserMove,
    handleSolved,
    hintCount,
    ideaItems,
    nextGoal,
    onHintRequested,
    setHintCount,
    setShowCorrect,
    showCorrect,
  } = useOpeningVariantController({ variant });

  // ============================================================================
  // Doğru çözüm dialog'u açıldığında konfeti bir kez tetiklenir.
  // ============================================================================
  useEffect(() => {
    if (!showCorrect) return;
    void confettiRef.current?.fire({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.45 },
    });
  }, [showCorrect]);

  // ============================================================================
  // Hint politikası controller tarafında yönetilir:
  // - Her step için en fazla 2 hint
  // - Kaçıncı hint olduğu board'a parametre olarak gönderilir
  // ============================================================================
  const handleHintClick = () => {
    const nextHintCount = onHintRequested();
    if (nextHintCount == null) return;
    boardRef.current?.showHint(nextHintCount);
  };

  return (
    <div className="container mx-auto max-w-5xl px-8 py-6">
      <SolveSuccessDialog
        open={showCorrect}
        onOpenChange={(open) => {
          if (!open) setShowCorrect(false);
        }}
        title="Line completed successfully"
        description={
          nextVariantId
            ? "Continue to the next variation."
            : "Return to the opening overview when you are ready."
        }
        destinationPath={
          nextVariantId != null
            ? `/openings/variant/${nextVariantId}`
            : parentOpeningUrl
        }
        buttonLabel={nextVariantId ? "Next variant" : "Back to opening"}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        {/*************** Left Column ***************/}
        <div key={variant.id} className="relative min-w-0">
          <Confetti
            ref={confettiRef}
            manualstart
            className="pointer-events-none absolute inset-0 z-10 size-full"
          />
          <VoltBoard
            ref={boardRef}
            sourceId={variant.id}
            initialFen={variant.initialFen ?? undefined}
            moves={variant.moves}
            width={580}
            height={580}
            className="border-muted rounded-xl border-4"
            viewOnly={false}
            onFenAfterUserMove={handleFenAfterUserMove}
            onFenAfterOpponentMove={handleFenAfterOpponentMove}
            onUserSuccessMovePlayed={() => setHintCount(0)}
            onSolved={handleSolved}
          />
        </div>

        {/*************** Right Column ***************/}
        <div className="flex min-w-0 flex-col gap-4">
          {/*************** Goals ***************/}
          {nextGoal ? (
            <ImageInformationCard
              imageSrc={
                nextGoal.imageSrc ??
                (nextGoal.card?.trim()
                  ? `/images/cards/${nextGoal.card.trim()}.png`
                  : "/images/cards/card-alt2-objective.png")
              }
              imageAlt={nextGoal.imageAlt ?? nextGoal.card ?? nextGoal.title}
              title={nextGoal.title}
              description={nextGoal.description}
            />
          ) : null}

          {/*************** Ideas (stacked; active expanded) ***************/}
          {ideaItems.length > 0 ? (
            <div className="flex flex-col gap-3">
              {ideaItems.map((item) => (
                <ImageInformationCard
                  key={item.title}
                  imageSrc={`/images/cards/card-alt2-${item.title.toLowerCase().replace(" ", "-")}.png`}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          ) : null}

          {/*************** Hint Button ***************/}
          <div>
            <VoltButton
              className="w-full"
              disabled={hintCount >= 2}
              onClick={handleHintClick}
            >
              Hint
            </VoltButton>
          </div>
        </div>
      </div>
    </div>
  );
}
