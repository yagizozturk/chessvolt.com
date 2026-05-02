"use client";

import { useEffect, useMemo, useState } from "react";

import { getUciMovesArrayFromPgn } from "@/lib/chess/getUciMovesArrayFromPgn";
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
  const pgnMoves = useMemo(() => getUciMovesArrayFromPgn(variant.pgn), [variant.pgn]);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [hintCount, setHintCount] = useState(0);
  const [activePly, setActivePly] = useState<number | null>(() => variant.ply);
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
  // - Aktif ply, variant başlangıç ply'sine döner
  // ============================================================================
  useEffect(() => {
    setHintCount(0);
    setMoveCount(0);
    setActivePly(variant.ply);
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
    const expectedMove = moves[moveCount];
    const isCorrect = playedMove.uci === expectedMove;

    return {
      isCorrect,
    };
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra tetiklenir.
  // Oynandığına göre hamle doğrudur.
  // Sonraki rakip hamlesi varsa index 2 artar; yoksa 1 artar.
  // ============================================================================
  function handleMovePlayed(playedMove: Move) {
    const currentStep = moveCount;
    const nextMove = moves[currentStep + 1];
    const nextUserStep = nextMove ? currentStep + 2 : currentStep + 1;
    setMoveCount(nextUserStep);
    setHintCount(0);

    // Oynanan hamlenin UCI'sine göre aktif ply'i günceller.
    // Rakip otomatik hamlesi varsa bir ply daha ileride olur.
    const expectedUserMovePly = variant.ply + currentStep + 1;
    const isExpectedPgnMove = !!playedMove.uci && pgnMoves?.[expectedUserMovePly - 1] === playedMove.uci;
    const userMovePly = isExpectedPgnMove ? expectedUserMovePly : variant.ply + nextUserStep;
    const updatedActivePly = nextMove ? userMovePly + 1 : userMovePly;
    setActivePly(updatedActivePly);
    setGoalsState((prev) =>
      prev.map((goal) => (goal.isCompleted || updatedActivePly >= goal.ply ? { ...goal, isCompleted: true } : goal)),
    );

    return {
      nextMove,
    };
  }

  // ============================================================================
  // Moves arrayi içindeki hamleyi bulmak için count ı arttrırır.
  // ============================================================================
  function incrementMoveCount() {
    setMoveCount((prev) => prev + 1);
  }

  // ============================================================================
  // Move count'u sıfırlar.
  // ============================================================================
  function resetMoveCount() {
    setMoveCount(0);
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
  // moveCount'a gore otomatik hesaplaniyor.
  // ============================================================================
  const currentCorrectMove = moves[moveCount] ?? null;

  return {
    moves,
    sortedGoals,
    nextGoal,
    hintCount,
    progressValue,
    handleMoveCheck,
    handleMovePlayed,
    incrementMoveCount,
    resetMoveCount,
    hintRequested,
    currentCorrectMove,
  };
}
