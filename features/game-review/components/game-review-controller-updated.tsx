"use client";

import { Chess } from "chess.js";
import Lottie from "lottie-react";
import { ChevronLeft, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { VoltCoach } from "@/components/volt-coach/volt-coach";
import { useImportedGames } from "@/features/game-review/components/imported-games-provider";
import { importedGameFocus } from "@/features/game-review/utilities/imported-game-label";
import type { GameAnalysis } from "@/features/game-analysis/types/game-analysis";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import { BoardPlayerName } from "@/features/game-review/components/board-player-name";
import { GameReviewQuestionStepper } from "@/features/game-review/components/game-review-question-stepper";
import { useGameReview } from "@/features/game-review/hooks/use-game-review";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { FavoriteButton } from "@/features/user-favorites/components/favorite-button";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import {
  createAttemptPayload,
  createSequenceCompleteStats,
} from "@/features/user-sequence-attempt/utilities/create-attempt-payload";
import { updateCorrectStreak } from "@/features/user-sequence-attempt/utilities/update-correct-streak";
import { useIsMobile } from "@/hooks/use-mobile";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type GameReviewControllerUpdatedProps = {
  analysis: GameAnalysis | null;
  source: GameAnalysisSource;
  gameId: string;
  reviewQuestions: GameReviewQuestion[];
  favoritedGameReviewQuestionIds: string[];
  backUrl?: string;
};

export default function GameReviewControllerUpdated(props: GameReviewControllerUpdatedProps) {
  return <div>Board burada olacak Sağ panel burada olacak</div>;
}
