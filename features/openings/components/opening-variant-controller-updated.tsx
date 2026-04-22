"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import VoltBoardUpdated, { type VoltBoardUpdatedHandle } from "@/components/volt-board-updated/volt-board-updated";
import { useOpeningVariantControllerUpdated } from "@/features/openings/hooks/use-opening-variant-controller-updated";
import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";

import type { OpeningVariant } from "../types/opening-variant";
import { OpeningVariantGoalViewer } from "./opening-variant-goal-viewer";

type OpeningVariantControllerUpdatedProps = {
  variant: OpeningVariant;
  nextVariantId: string | null;
  parentOpeningUrl: string;
};

export default function OpeningVariantControllerUpdated({
  variant,
  nextVariantId,
  parentOpeningUrl,
}: OpeningVariantControllerUpdatedProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardUpdatedHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { updateOpeningVariantAnswerHook } = useUpdateOpeningVariantAnswer();
  const {
    _handleMoveCheck,
    _handleMovePlayed,
    _nextGoal,
    _totalGoals,
    _currentGoalIndex,
    _progressValue,
    _hintCount,
    _hintRequested,
    _currentExpectedMove,
  } = useOpeningVariantControllerUpdated({
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
    if (_currentExpectedMove != null || isCompleted) return;

    setIsCompleted(true);
    void updateOpeningVariantAnswerHook(variant.id, true);
  }, [isCompleted, _currentExpectedMove, updateOpeningVariantAnswerHook, variant.id]);

  // ============================================================================
  // handle metotları controller a aittir, _değişkenler hook a aittir.
  // Oyuncu hamle denemesi yapınca önce onay verir/reddeder.
  // ============================================================================
  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = _handleMoveCheck(move);
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
  function handleBoardMovePlayed(move: MoveEvaluationPayload) {
    const { nextMove } = _handleMovePlayed(move);
    return nextMove;
  }

  // ============================================================================
  // Hint politikası controller tarafında yönetilir:
  // - Her step için en fazla 2 hint
  // - Kaçıncı hint olduğu board'a parametre olarak gönderilir
  // Hint değer hook da tutulur
  // ============================================================================
  const handleHintClick = () => {
    const nextHintCount = _hintRequested();
    if (nextHintCount == null || !_currentExpectedMove) return;
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
    <div className="container mx-auto max-w-6xl px-8 py-6">
      <div className="grid gap-4 lg:grid-cols-[620px_minmax(0,1fr)] lg:gap-4">
        <div key={variant.id} className="relative w-full min-w-0">
          <VoltBoardUpdated
            ref={boardRef}
            sourceId={variant.id}
            expectedMove={_currentExpectedMove}
            onCheckMove={handleBoardCheckMove}
            onMovePlayed={handleBoardMovePlayed}
          />
        </div>
        <div className="flex h-full min-w-0 flex-col gap-4">
          <div className="flex h-full flex-col space-y-4">
            <Card className="flex h-full flex-1 flex-col border-0 shadow-none">
              <CardHeader className="pb-3">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                  <div className="flex items-center">
                    <ArrowLeft className="text-muted-foreground size-4" aria-hidden="true" />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2 text-center">
                    <BookOpen className="text-muted-foreground size-4" aria-hidden="true" />
                    <span>{variant.title ?? "Untitled variant"}</span>
                  </CardTitle>
                  <div aria-hidden="true" />
                </div>
                <Separator className="mt-3" />
              </CardHeader>
              <CardContent className="flex h-full flex-1">
                <OpeningVariantGoalViewer nextGoal={_nextGoal} />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="flex w-full flex-col gap-2">
                  {_totalGoals > 0 ? (
                    <p className="text-muted-foreground text-xs">
                      Goal {_currentGoalIndex} / {_totalGoals}
                    </p>
                  ) : null}
                  <Progress value={_progressValue} className="h-2" />
                </div>
                <div className="w-full">
                  <Button className="w-full" variant="outline" disabled={_hintCount >= 2} onClick={handleHintClick}>
                    Hint
                  </Button>
                </div>
                {isCompleted ? (
                  <div className="w-full">
                    <Button className="w-full" onClick={handleContinueClick}>
                      {nextVariantId ? "Next variant" : "Back to opening"}
                    </Button>
                  </div>
                ) : null}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
