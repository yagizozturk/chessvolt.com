"use client";

import { GoalStepper } from "@/components/goal-stepper/goal-stepper";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { VariantSlider } from "@/components/variant-slider/variant-slider";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type {
  MoveGoal,
  OpeningVariant,
} from "@/features/openings/types/opening-variant";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { Lightbulb, Target } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function OpeningVariantController({
  variant,
  siblingVariants,
  nextVariantId,
  parentOpeningUrl = "/openings",
}: {
  variant: OpeningVariant;
  /** Aynı opening altındaki tüm varyantlar (sıralı); varyant seçici için. */
  siblingVariants?: OpeningVariant[];
  nextVariantId?: string | null;
  parentOpeningUrl?: string; //TODO: Bu ne işe yarıyor kontrol et.
}) {
  const boardRef = useRef<VoltBoardHandle>(null);
  const confettiRef = useRef<ConfettiRef>(null);
  const [hintCount, setHintCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  /** PGN’e göre mevcut tahta pozisyonunun ply’si (FEN eşlemesi) */
  const [activePly, setActivePly] = useState<number | null>(() => variant.ply);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();

  const sortedGoals = useMemo(() => {
    const g = variant.goals;
    if (!g?.length) return [];
    return [...g].sort((a, b) => a.ply - b.ply);
  }, [variant.goals]);

  /** activePly hedef ply’ine ulaştıysa / geçtiyse tamam (bir sonraki hedefe geçilebildiyse önceki biter) */
  const isGoalDone = (goal: MoveGoal) =>
    activePly != null && activePly >= goal.ply;

  const activeSliderIndex = useMemo(() => {
    if (sortedGoals.length === 0) return 0;
    const highlighted = sortedGoals.findIndex(
      (g) => activePly != null && g.ply === activePly + 1,
    );
    if (highlighted !== -1) return highlighted;
    const firstIncomplete = sortedGoals.findIndex(
      (g) => activePly == null || activePly < g.ply,
    );
    if (firstIncomplete !== -1) return firstIncomplete;
    return sortedGoals.length - 1;
  }, [sortedGoals, activePly]);

  const goalStepperItems = useMemo(
    () =>
      sortedGoals.map((g) => ({
        title: g.title,
        description: g.description,
        imageSrc: g.imageSrc ?? "/images/cards/card_pawn_pyramid.png",
        imageAlt: g.imageAlt ?? g.title,
        completed: isGoalDone(g),
      })),
    [sortedGoals, activePly],
  );

  useEffect(() => {
    setHintCount(0);
    setActivePly(variant.ply);
  }, [variant.id, variant.ply]);

  useEffect(() => {
    if (!showCorrect) return;
    void confettiRef.current?.fire({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.45 },
    });
  }, [showCorrect]);

  // ======================================================================
  // If there is another unsolved variant, go to that page
  // If all the variants are solved, return to main opening page
  // ======================================================================
  const handleSolved = async (isCorrect: boolean) => {
    await updateOpeningVariantAnswerHook(variant.id, isCorrect);
    if (isCorrect) {
      setShowCorrect(true);
    }
  };

  const handleFenAfterUserMove = (fen: string) => {
    const ply = getPlyFromPgnAtFen(variant.pgn, fen);
    if (ply !== null) setActivePly(ply);
  };

  const handleFenAfterOpponentMove = (fen: string) => {
    const ply = getPlyFromPgnAtFen(variant.pgn, fen);
    if (ply !== null) setActivePly(ply);
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
        {/*************** Board ***************/}
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
            width={600}
            height={600}
            className="border-muted rounded-xl border-4"
            viewOnly={false}
            onFenAfterUserMove={handleFenAfterUserMove}
            onFenAfterOpponentMove={handleFenAfterOpponentMove}
            onSolved={handleSolved}
            onHintUsed={setHintCount}
          />
          <div className="pt-3">
            <VariantSlider
              variants={siblingVariants ?? []}
              activeVariantId={variant.id}
            />
          </div>
        </div>

        {/*************** Move Count, Turn, Goals ***************/}
        <div className="flex min-w-0 flex-col gap-4">
          {/*************** Goals (stacked; active expanded) ***************/}
          {goalStepperItems.length > 0 ? (
            <GoalStepper
              items={goalStepperItems}
              activeIndex={activeSliderIndex}
            />
          ) : null}

          {/*************** Hint Button ***************/}
          <Button
            variant="default"
            size="lg"
            className="w-full"
            disabled={hintCount >= 2}
            onClick={() => boardRef.current?.showHint()}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Hint
          </Button>
        </div>
      </div>
    </div>
  );
}
