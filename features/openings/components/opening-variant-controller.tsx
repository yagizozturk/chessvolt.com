"use client";

import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { Notifier } from "@/components/notifier/notifier";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import { VoltButton } from "@/components/volt-button/volt-button";
import { useOpeningVariantController } from "@/features/openings/hooks/use-opening-variant-controller";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

import type { OpeningVariant } from "../types/opening-variant";
import { OpeningVariantGoalViewer } from "./opening-variant-goal-viewer/opening-variant-goal-viewer";

type OpeningVariantControllerProps = {
  variant: OpeningVariant;
  nextVariantId: string | null;
  parentOpeningUrl: string;
};

export default function OpeningVariantController({
  variant,
  nextVariantId,
  parentOpeningUrl,
}: OpeningVariantControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();
  const { playLevelUpSound } = useBoardSounds();
  const {
    handleMoveCheck,
    handleMovePlayed,
    sortedGoals,
    progressValue,
    hintCount,
    hintRequested,
    currentCorrectMove,
  } = useOpeningVariantController({
    variant,
  });

  // ============================================================================
  // Variant değiştiğinde local ekran state'i sıfırlanır:
  // - varyantın tamamnlandımı bilgisi resetlenir
  // ============================================================================
  useEffect(() => {
    setIsCompleted(false);
  }, [variant.id]);

  // ============================================================================
  // isCompleted değiştiğinde ya da hamle değiştiğinde tamamlandı işaretliyoruz
  // ============================================================================
  useEffect(() => {
    if (currentCorrectMove != null || isCompleted) return;

    setIsCompleted(true);
    playLevelUpSound();
    void updateOpeningVariantAnswerHook(variant.id, true);
  }, [isCompleted, currentCorrectMove, updateOpeningVariantAnswerHook, variant.id]);

  // ============================================================================
  // handle metotları controller a aittir, _değişkenler hook a aittir.
  // Oyuncu hamle denemesi yapınca önce onay verir/reddeder.
  // ============================================================================
  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = handleMoveCheck(move);
    if (!isCorrect && !isCompleted) {
      // void, burada metodu çağırmak için değil, dönen Promise’i bilinçli olarak “await etmiyorum” demek için
      void updateOpeningVariantAnswerHook(variant.id, false);
    }
    return isCorrect;
  }

  // ============================================================================
  // After move played from the board, controller handleBoardMovePlayed is
  // triggered that asks HOOK for nextMove information. nextMove is returned to
  // volt-board to play the opponent move.
  // ============================================================================
  function handleBoardMovePlayed(move: Move) {
    const { nextMove } = handleMovePlayed(move);
    return nextMove;
  }

  // ============================================================================
  // Hint politikası controller tarafında yönetilir:
  // - Her step için en fazla 2 hint
  // - Kaçıncı hint olduğu board'a parametre olarak gönderilir
  // Hint değer hook da tutulur
  // ============================================================================
  const handleHintClick = () => {
    const nextHintCount = hintRequested();
    if (nextHintCount == null || !currentCorrectMove) return;
    boardRef.current?.showHint(nextHintCount);
  };

  // ============================================================================
  // Next variant veya opening sayfasına yönlendirir. Variant bitince gözükür
  // ============================================================================
  const handleContinueClick = () => {
    const destinationPath = nextVariantId ? `/openings/variant/${nextVariantId}` : parentOpeningUrl;
    router.push(destinationPath);
  };

  return (
    <div className="container mx-auto max-w-6xl px-20 py-6">
      <Notifier goals={sortedGoals} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div key={variant.id} className="relative w-full min-w-0 lg:w-auto lg:shrink-0">
          <VoltBoard
            ref={boardRef}
            sourceId={variant.id}
            size={580}
            drawHintMove={currentCorrectMove}
            onCheckMove={handleBoardCheckMove}
            onMovePlayed={handleBoardMovePlayed}
          />
        </div>
        {/* min-w-0: allows the right panel to shrink within the flex row */}
        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">{variant.title ?? "Untitled variant"}</span>
          </div>
          <div className="flex items-center">
            <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
            <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
              <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
            </div>
          </div>
          <OpeningVariantGoalViewer goals={sortedGoals} />
          <div className="mt-auto">
            {!isCompleted ? (
              <div>
                <VoltButton onClick={handleHintClick} text="Hint" disabled={hintCount >= 2} fullWidth={true} />
              </div>
            ) : (
              <div className="mt-4">
                <VoltButton
                  onClick={handleContinueClick}
                  text={nextVariantId ? "Next variant" : "Back to opening"}
                  fullWidth={true}
                  muted={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isCompleted ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-50 size-full max-h-none max-w-none" />
      ) : null}
    </div>
  );
}
