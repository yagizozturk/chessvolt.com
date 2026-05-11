"use client";

import { useEffect, useMemo, useState } from "react";

import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

import type { MoveGoal, OpeningVariant } from "../types/opening-variant";

type UseOpeningVariantControllerParams = {
  variant: OpeningVariant;
};

export function useOpeningVariantController({ variant }: UseOpeningVariantControllerParams) {
  const moves = variant.moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  const [nextExpectedMoveIndex, setNextExpectedMoveIndex] = useState<number>(0);
  const [hintCount, setHintCount] = useState(0);
  const [goalsState, setGoalsState] = useState<MoveGoal[]>([]);

  // ============================================================================
  // Goals variant içinden alınır ve ply sırasına göre yukarıdan aşağıya dizilir.
  // Stepper bu sıralı listeyi kullanır.
  // TODO: REFACTOR
  // ============================================================================
  const sortedGoals = useMemo(() => {
    return [...goalsState].sort((a, b) => a.ply - b.ply);
  }, [goalsState]);

  // .find() returns the first element.
  const nextGoal = useMemo(() => {
    return sortedGoals.find((goal) => !goal.isCompleted) ?? null;
  }, [sortedGoals]);

  // ============================================================================
  // Variant içindneki Progress value'u hesaplar.
  // ============================================================================
  const progressValue = useMemo(() => {
    if (!sortedGoals.length) return 0;

    const completedGoalsCount = sortedGoals.filter((goal) => goal.isCompleted).length;

    return Math.round((completedGoalsCount / sortedGoals.length) * 100);
  }, [sortedGoals]);

  // ============================================================================
  // Variant değiştiğinde local ekran state'i sıfırlanır:
  // - Hint hakkı yeniden başlar
  // - isCompleted goal için true olur
  // ============================================================================
  useEffect(() => {
    setHintCount(0);
    setNextExpectedMoveIndex(0);
    setGoalsState(
      [...(variant.goals ?? [])]
        .sort((a, b) => a.ply - b.ply)
        .map((goal) => ({
          ...goal,
          isCompleted: goal.isCompleted || variant.ply >= goal.ply,
        })),
    );
  }, [variant.id, variant.ply, variant.goals]);

  // ============================================================================
  // Oyuncu hamle yapınca önce kontole girer(attempt) ve tetiklenir.
  // ============================================================================
  function handleMoveCheck(playedMove: MoveAttemptPayload) {
    const expectedMove = moves[nextExpectedMoveIndex];
    const isCorrect = playedMove.uci === expectedMove;

    return {
      isCorrect,
    };
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra tetiklenir.
  // Oynandığına göre hamle doğrudur.
  // Sonraki rakip hamlesi varsa index 2 artar; yoksa 1 artar.
  // Bir sonraki hamleyi döner
  // Goal tamamlama: move.uci, goals[].move ile eşleşen kayıtta isCompleted true.
  // ============================================================================
  function handleSuccessMovePlayed(move: Move) {
    const { uci } = move;
    if (!uci) return;

    setGoalsState((prev) => prev.map((goal) => (goal.move === uci ? { ...goal, isCompleted: true } : goal)));
  }

  // ============================================================================
  // Sıradaki oynanması gereken hamleyi döner
  // ============================================================================
  function handleNextMoveRequest() {
    const currentStep = nextExpectedMoveIndex; // 0 ile başlıyor
    const nextMove = moves[currentStep + 1];
    const nextUserStep = nextMove ? currentStep + 2 : currentStep + 1; // Oyuncu için 1 hamle atlanacağından (varyant bitmediyse) sonraki hamle currentStep + 2
    setNextExpectedMoveIndex(nextUserStep);
    setHintCount(0);
    return nextMove;
  }

  // ============================================================================
  // Moves dizisinde sıradaki beklenen hamle indeksini bir artırır.
  // ============================================================================
  function incrementNextExpectedMoveIndex() {
    setNextExpectedMoveIndex((prev) => prev + 1);
  }

  // ============================================================================
  // Sıradaki beklenen hamle indeksini sıfırlar.
  // ============================================================================
  function resetNextExpectedMoveIndex() {
    setNextExpectedMoveIndex(0);
  }

  // ============================================================================
  // Hint politikası controller tarafında yönetilir:
  // - Her step için en fazla 2 hint
  // - Kaçıncı hint olduğu board'a parametre olarak gönderilir
  // ============================================================================
  const hintRequested = () => {
    if (hintCount >= 2) return null;

    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    return nextHintCount;
  };

  // ============================================================================
  // Sıradaki oynanması gereken hamle
  // currentCorrectMove bir derived value:
  // nextExpectedMoveIndex'e göre otomatik hesaplanıyor.
  // ============================================================================
  const currentCorrectMove = moves[nextExpectedMoveIndex] ?? null;

  return {
    moves,
    sortedGoals,
    nextGoal,
    hintCount,
    progressValue,
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    incrementNextExpectedMoveIndex,
    resetNextExpectedMoveIndex,
    hintRequested,
    currentCorrectMove,
  };
}
