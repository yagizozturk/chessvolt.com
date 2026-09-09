"use client";

import { Chess } from "chess.js";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useImportedGames } from "@/features/analysis/components/imported-games-provider";
import { importedGameFocus } from "@/features/analysis/utilities/imported-game-label";
import type { GameAnalysis, GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import { GameReviewPanel } from "@/features/game-review/components/game-review-panel";
import { useGameReview } from "@/features/game-review/hooks/use-game-review";
import { useIsMobile } from "@/hooks/use-mobile";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";

type GameReviewControllerProps = {
  analysis: GameAnalysis | null;
  source: GameAnalysisSource;
  gameId: string;
  backUrl?: string;
};

export default function GameReviewController({
  analysis,
  source,
  gameId,
  backUrl = "/analysis",
}: GameReviewControllerProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const didAutoReview = useRef(false);
  const { findGame, chesscomUsername, lichessUsername } = useImportedGames();
  const { status, error, criticalMoments, selectedMoment, review, selectMoment } = useGameReview(
    analysis?.data,
  );

  const importedGame = findGame(source, gameId);
  const pgn = analysis?.data.pgn?.trim() || importedGame?.pgn?.trim() || "";
  const sourceId = `game-review-${source}-${gameId}`;
  const focusUsername = source === "chesscom" ? chesscomUsername : lichessUsername;
  const { youAreBlack } = importedGame
    ? importedGameFocus(importedGame, focusUsername)
    : { youAreBlack: false };
  const boardFen =
    selectedMoment?.fen ??
    criticalMoments[0]?.fen ??
    getFenFromPgnAtPly(pgn, 0) ??
    new Chess().fen();
  useEffect(() => {
    if (didAutoReview.current || analysis?.data.criticalMoments.length || !pgn) return;
    didAutoReview.current = true;
    void review(pgn, { source, gameId });
  }, [analysis, gameId, pgn, review, source]);

  useEffect(() => {
    if (selectedMoment || criticalMoments.length === 0) return;
    selectMoment(criticalMoments[0]);
  }, [criticalMoments, selectMoment, selectedMoment]);

  const handleBackClick = () => {
    startTransition(() => {
      router.push(backUrl);
    });
  };

  return (
    <div className="page-container">
      <div className="page-container-controller-layout">
        <div className="relative aspect-square w-full shrink-0 self-start md:min-w-0 md:flex-[3]">
          <VoltBoard
            key={`${sourceId}-${boardFen}`}
            sourceId={sourceId}
            initialFen={boardFen}
            coordinates={!isMobile}
            playerOrientation={youAreBlack ? "black" : "white"}
            viewOnly
            onCheckMove={() => true}
            onSuccessMovePlayed={() => {}}
            onNextMoveRequest={() => undefined}
          />
        </div>

        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          <div className="flex justify-between">
            <div>
              <Button variant="voltIcon" onClick={handleBackClick} disabled={isPending} aria-label="Back">
                {isPending ? <Spinner className="size-5" /> : <ChevronLeft className="size-5" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Image
                src="/images/icons/icon-sword.png"
                alt=""
                aria-hidden
                width={30}
                height={30}
                className="size-7 shrink-0"
              />
              Game review
            </div>
            <div className="size-9" />
          </div>

          <GameReviewPanel
            moments={criticalMoments}
            selectedPly={selectedMoment?.ply ?? null}
            isLoading={status === "loading"}
            error={error}
            hasResult={status === "success"}
            disabled={!pgn}
            onReview={() => {
              void review(pgn, { source, gameId });
            }}
            onSelectMoment={selectMoment}
          />
        </div>
      </div>
    </div>
  );
}
