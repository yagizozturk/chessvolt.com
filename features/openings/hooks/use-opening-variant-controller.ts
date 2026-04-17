import { useUpdateOpeningVariantAnswer } from "@/features/openings/hooks/use-update-opening-variant";
import type {
  MoveGoal,
  OpeningVariant,
} from "@/features/openings/types/opening-variant";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { useEffect, useMemo, useState } from "react";

type UseOpeningVariantControllerParams = {
  variant: OpeningVariant;
};

export function useOpeningVariantController({
  variant,
}: UseOpeningVariantControllerParams) {
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

  const nextGoal = useMemo(() => {
    if (activePly == null) return null;
    return sortedGoals.find((goal) => goal.ply === activePly + 1) ?? null;
  }, [sortedGoals, activePly]);

  // ============================================================================
  // activePly hedef ply’ine ulaştıysa / geçtiyse tamam
  // (bir sonraki hedefe geçilebildiyse önceki biter)
  // ============================================================================
  const isGoalDone = (goal: MoveGoal) =>
    activePly != null && activePly >= goal.ply;

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
    setShowCorrect(false);
  }, [variant.id, variant.ply]);

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
  const onHintRequested = () => {
    if (hintCount >= 2) return null;

    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    return nextHintCount;
  };

  return {
    activePly,
    handleFenAfterOpponentMove,
    handleFenAfterUserMove,
    handleSolved,
    hintCount,
    ideaItems,
    isGoalDone,
    nextGoal,
    onHintRequested,
    setHintCount,
    setShowCorrect,
    showCorrect,
    sortedGoals,
  };
}
