"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Flag,
  Circle,
  Lightbulb,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
import PuzzleBoard, {
  type PuzzleBoardHandle,
} from "@/features/puzzle/components/puzzle-board";
import { useStatsStore } from "@/features/home/store/stats-store";
import { useUpdateGameRiddleAnswer } from "@/features/game-riddle/hooks/use-update-game-riddle";
import { addReward } from "@/features/profile/api/profile";
import { calculatePointsFromTime } from "@/lib/utilities/reward";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/countdown-timer/countdown-timer";

type RiddleControllerProps = {
  riddle: GameRiddle;
  game: Game;
};

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
  const turn = riddle.ply % 2 === 0 ? "White" : "Black";
  const streak = useStatsStore((state) => state.streak);
  const initLives = useStatsStore((state) => state.initLives);
  const decrementLives = useStatsStore((state) => state.decrementLives);
  const setStreak = useStatsStore((state) => state.setStreak);
  const { updateGameRiddleAnswerHook } = useUpdateGameRiddleAnswer();
  const boardRef = useRef<PuzzleBoardHandle>(null);
  const [hintCount, setHintCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const TOTAL_SECONDS = 5 * 60;

  useEffect(() => {
    initLives();
    setHintCount(0);
    startTimeRef.current = Date.now();
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
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const points = calculatePointsFromTime(elapsed, TOTAL_SECONDS);
      await addReward(points).catch(() => {});
      setElapsedSeconds(Math.round(elapsed));
      setEarnedPoints(points);
      setShowCorrect(true);
      setTimeout(() => {
        if (challengeSlug) router.push(`/challenge/${challengeSlug}`);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="relative min-w-0">
          {showCorrect && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
              <Card className="animate-in zoom-in-95 fade-in-0 min-w-[280px] border-emerald-500/40 bg-emerald-50/95 shadow-xl duration-200 dark:border-emerald-400/30 dark:bg-emerald-950/95">
                <CardContent className="flex flex-col items-center gap-6 px-12 py-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-3 text-center">
                    <p className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
                      Doğru!
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {elapsedSeconds} saniyede çözdün
                    </p>
                    <Badge
                      variant="secondary"
                      className="border-emerald-500/30 bg-emerald-500/20 px-4 py-1.5 text-base font-semibold text-emerald-700 dark:text-emerald-300"
                    >
                      +{earnedPoints} puan
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <PuzzleBoard
            ref={boardRef}
            sourceId={riddle.id}
            mode="riddle"
            pgn={game.pgn}
            ply={riddle.ply}
            moves={riddle.moves ?? ""}
            width={600}
            height={600}
            className="border-muted rounded-xl border-4"
            onSolved={handleSolved}
            onHintUsed={setHintCount}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div className="border-border bg-muted/50 flex items-center justify-center gap-6 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Clock className="text-primary h-5 w-5" />
              <CountdownTimer
                minutes={5}
                className="text-foreground text-2xl font-bold"
              />
            </div>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {riddle.title}
              </CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm">
                {game.event && (
                  <span className="flex items-center gap-1.5">
                    <Flag className="text-primary h-3.5 w-3.5" />
                    {game.event}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="text-primary h-3.5 w-3.5" />
                  {formatDate(game.playedAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-border bg-muted/50 flex items-center gap-2 rounded-lg border p-3">
                <Circle className="fill-primary text-primary h-4 w-4 shrink-0" />
                <span className="text-muted-foreground text-sm">Turn:</span>
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/20 text-primary"
                >
                  {turn} to move
                </Badge>
              </div>
              <div className="flex flex-col gap-3">
                <div className="border-border bg-muted/50 flex w-full items-center gap-3 rounded-lg border p-3">
                  <div className="bg-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                    <User className="text-primary h-4 w-4" />
                  </div>
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
                  <div className="bg-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                    <User className="text-primary h-4 w-4" />
                  </div>
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
            </CardContent>
          </Card>

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
