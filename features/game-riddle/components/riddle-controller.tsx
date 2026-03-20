"use client";

import { SuccessOverlay } from "@/components/success-overlay/success-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import VoltBoard, {
  type VoltBoardHandle,
} from "@/components/volt-board/volt-board";
import { useUpdateGameRiddleAnswer } from "@/features/game-riddle/hooks/use-update-game-riddle";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
import { useStatsStore } from "@/features/home/store/stats-store";
import { addReward } from "@/features/profile/api/profile";
import { CHALLENGE_SOLVE_REWARD_POINTS } from "@/lib/shared/constants/challenge";
import { Calendar, Flag, Lightbulb, Puzzle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type RiddleControllerProps = {
  riddle: GameRiddle;
  game: Game;
};

function getMoveCount(moves: string | null): number {
  if (!moves?.trim()) return 0;
  const arr = moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  return Math.ceil(arr.length / 2);
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function RiddleController({
  riddle,
  game,
}: RiddleControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const turn = (riddle.displayFen?.includes(" w ") ?? true) ? "White" : "Black";
  const moveCount = getMoveCount(riddle.moves);
  const initLives = useStatsStore((state) => state.initLives);
  const decrementLives = useStatsStore((state) => state.decrementLives);
  const streak = useStatsStore((state) => state.streak);
  const setStreak = useStatsStore((state) => state.setStreak);
  const [hintCount, setHintCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const { updateGameRiddleAnswerHook } = useUpdateGameRiddleAnswer();

  useEffect(() => {
    initLives();
    setHintCount(0);
  }, [riddle.id, initLives]);

  // ===================================================================
  // When riddle is answered correctly, redirect user back to challenge
  // page. gameType is already in the riddle. I know where they came from.
  // Controller handles this flow
  // ===================================================================
  const challengeSlug = riddle.gameType?.replace(/_/g, "-");
  const handleSolved = async (isCorrect: boolean) => {
    if (isCorrect) {
      setStreak(streak + 1);
    } else {
      decrementLives();
      setStreak(0);
    }
    await updateGameRiddleAnswerHook(riddle.id, isCorrect);
    if (isCorrect) {
      const points = CHALLENGE_SOLVE_REWARD_POINTS;
      await addReward(points).catch(() => {});
      setEarnedPoints(points);
      setShowCorrect(true);
      setTimeout(() => {
        if (challengeSlug) router.push(`/challenge/${challengeSlug}`);
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-8 py-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="relative min-w-0">
          <SuccessOverlay show={showCorrect} earnedPoints={earnedPoints} />
          <VoltBoard
            ref={boardRef}
            sourceId={riddle.id}
            mode="riddle"
            coordinates={true}
            initialFen={riddle.displayFen}
            moves={riddle.moves ?? ""}
            width={600}
            height={600}
            className="border-muted rounded-xl border-4"
            onSolved={handleSolved}
            onHintUsed={setHintCount}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-950/50">
              <div
                className={`h-7 w-7 shrink-0 rounded-full border-2 ${
                  turn === "White"
                    ? "border-gray-300 bg-white dark:border-gray-600"
                    : "border-gray-800 bg-black dark:border-gray-400"
                }`}
              />
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Turn
              </p>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                {turn}
              </span>
            </div>
            {moveCount > 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-50 p-4 dark:border-emerald-400/30 dark:bg-emerald-950/50">
                <Puzzle className="h-7 w-7 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Moves To Find
                </p>
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {moveCount} {moveCount === 1 ? "move" : "moves"}
                </span>
              </div>
            )}
          </div>

          <Card>
            <CardHeader className="min-w-0 overflow-hidden">
              <CardTitle className="truncate text-2xl font-bold">
                {riddle.title}
              </CardTitle>
              <div className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 overflow-hidden pt-2 text-sm">
                {game.event && (
                  <span className="flex max-w-full min-w-0 shrink items-center gap-1.5 overflow-hidden">
                    <Flag className="text-primary h-3.5 w-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{game.event}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="text-primary h-3.5 w-3.5" />
                  {formatDate(game.playedAt)}
                </span>
              </div>
            </CardHeader>
          </Card>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="border-border bg-muted/50 flex w-full items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    White
                  </p>
                  <p className="text-foreground truncate font-medium">
                    {game.whitePlayer}
                  </p>
                </div>
              </div>
              <div className="border-border bg-muted/50 flex w-full items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-800 bg-black dark:border-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Black
                  </p>
                  <p className="text-foreground truncate font-medium">
                    {game.blackPlayer}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
