"use client";

import { ActiveGoalViewer } from "@/components/active-goal-viewer/active-goal-viewer";
import GoalProgress from "@/components/goal-progress/goal-progress";
import CardInformer from "@/components/informer/card-informer";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { DuolingoButton } from "@/components/ui/duolingo-button";
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
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [hintCount, setHintCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [activePly, setActivePly] = useState<number | null>(() => variant.ply);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();

  // ============================================================================
  // Goals variant içinden alınır ve ply sırasına göre yukarıdan aşağıya dizilir.
  // Stepper bu sıralı listeyi kullanır.
  // ============================================================================
  const sortedGoals = useMemo(() => {
    const g = variant.goals;
    if (!g?.length) return [];
    return [...g].sort((a, b) => a.ply - b.ply);
  }, [variant.goals]);

  // ============================================================================
  // activePly hedef ply’ine ulaştıysa / geçtiyse tamam
  // (bir sonraki hedefe geçilebildiyse önceki biter)
  // ============================================================================
  const isGoalDone = (goal: MoveGoal) =>
    activePly != null && activePly >= goal.ply;

  // ============================================================================
  // GoalStepper içinde hangi adımın aktif/highlight olacağını hesaplar.
  // Önce "bir sonraki hedef"i bulur; yoksa ilk tamamlanmamışı seçer.
  // ============================================================================
  const activeGoalStepIndex = useMemo(() => {
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

  // ============================================================================
  // Goal verisini GoalStepper bileşeninin beklediği item formatına dönüştürür.
  // completed alanı activePly üzerinden dinamik hesaplanır.
  // ============================================================================
  const goalStepperItems = useMemo(
    () =>
      sortedGoals.map((g) => {
        const cardCode = g.card?.trim();
        return {
          title: g.title,
          description: g.description,
          imageSrc: cardCode ? `/images/cards/${cardCode}.png` : "",
          imageAlt: cardCode ?? g.title,
          completed: isGoalDone(g),
        };
      }),
    [sortedGoals, activePly],
  );

  const ideaItems = useMemo(() => {
    if (!variant.ideas) return [];

    return [
      { title: "Core idea", description: variant.ideas.core_idea },
      { title: "Common mistake", description: variant.ideas.common_mistake },
    ].filter((item) => item.description?.trim().length > 0);
  }, [variant.ideas]);

  // ============================================================================
  // Variant değiştiğinde local ekran state'i sıfırlanır:
  // - Hint hakkı yeniden başlar
  // - Aktif ply, variant başlangıç ply'sine döner
  // ============================================================================
  useEffect(() => {
    setHintCount(0);
    setActivePly(variant.ply);
  }, [variant.id, variant.ply]);

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

  // ============================================================================
  // Kullanıcının doğru hamlesinden sonra gelen FEN'i PGN içinde ply'e çevirir.
  // Böylece goal ilerlemesi doğru adımı işaretler.
  // ============================================================================
  const handleFenAfterUserMove = (fen: string) => {
    const ply = getPlyFromPgnAtFen(variant.pgn, fen);
    if (ply !== null) setActivePly(ply);
  };

  // ============================================================================
  // Rakip otomatik hamlesinden sonra da activePly güncellenir.
  // Stepper bir sonraki hedefi doğru highlight eder.
  // ============================================================================
  const handleFenAfterOpponentMove = (fen: string) => {
    const ply = getPlyFromPgnAtFen(variant.pgn, fen);
    if (ply !== null) setActivePly(ply);
  };

  // ============================================================================
  // Hint politikası controller tarafında yönetilir:
  // - Her step için en fazla 2 hint
  // - Kaçıncı hint olduğu board'a parametre olarak gönderilir
  // ============================================================================
  const handleHintClick = () => {
    if (hintCount >= 2) return;
    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
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
          {/*************** Goal Progress ***************/}
          {goalStepperItems.length > 0 ? (
            <GoalProgress
              completedGoals={
                goalStepperItems.filter((item) => item.completed).length
              }
              totalGoals={goalStepperItems.length}
            />
          ) : null}

          {/*************** Goals (stacked; active expanded) ***************/}
          {goalStepperItems.length > 0 ? (
            <ActiveGoalViewer
              items={goalStepperItems}
              activeIndex={activeGoalStepIndex}
            />
          ) : null}

          {/*************** Ideas (stacked; active expanded) ***************/}
          {ideaItems.length > 0 ? (
            <div className="flex flex-col gap-3">
              {ideaItems.map((item) => (
                <CardInformer
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
            <DuolingoButton
              className="w-full"
              disabled={hintCount >= 2}
              onClick={handleHintClick}
            >
              Hint
            </DuolingoButton>
          </div>
          <div className="pt-1">
            <VariantSlider
              variants={siblingVariants ?? []}
              activeVariantId={variant.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
