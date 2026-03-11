"use client";

import { useEffect, useRef } from "react";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import { getNextTurnFromFen } from "@/lib/chess/getTurn";
import { useStatsStore } from "@/features/home/store/stats-store";
import { useUpdatePuzzleAnswer } from "@/features/puzzle/hooks/use-update-puzzle";
import { addReward } from "@/api-client/profile";
import { calculatePointsFromTime } from "@/lib/utilities/reward";
import { CountdownTimer } from "@/components/countdown-timer/countdown-timer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap, Circle, BarChart3, Tag, Clock } from "lucide-react";

export default function PuzzleController({ puzzle }: { puzzle: Puzzle }) {
  const turnText = getNextTurnFromFen(puzzle.fen);
  const streak = useStatsStore((state) => state.streak);
  const initLives = useStatsStore((state) => state.initLives);
  const decrementLives = useStatsStore((state) => state.decrementLives);
  const setStreak = useStatsStore((state) => state.setStreak);
  const xp = 0;
  const { updatePuzzleAnswerHook } = useUpdatePuzzleAnswer();
  const startTimeRef = useRef<number>(Date.now());
  const TOTAL_SECONDS = 5 * 60;

  useEffect(() => {
    initLives();
    startTimeRef.current = Date.now();
  }, [puzzle.id, initLives]);

  const handleSolved = async (isCorrect: boolean) => {
    if (isCorrect) {
      setStreak(streak + 1);
    } else {
      decrementLives();
      setStreak(0);
    }
    await updatePuzzleAnswerHook(puzzle.id, isCorrect);
    if (isCorrect) {
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      const points = calculatePointsFromTime(elapsedSeconds, TOTAL_SECONDS);
      await addReward(points).catch(() => {});
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        {/* Left: Puzzle Board */}
        <div>
          <PuzzleBoard
            sourceId={puzzle.id}
            mode="puzzle"
            initialFen={puzzle.fen}
            moves={puzzle.moves}
            width={620}
            height={620}
            viewOnly={false}
            onSolved={handleSolved}
          />
        </div>

        {/* Right: Stats & Info */}
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
          <div className="grid grid-cols-2 gap-2">
            <div className="border-border bg-muted/50 flex flex-col items-center gap-1 rounded-lg border p-3">
              <Flame className="text-primary h-5 w-5" />
              <span className="text-foreground text-2xl font-bold">
                {streak}
              </span>
              <span className="text-muted-foreground text-xs">Streak</span>
            </div>
            <div className="border-border bg-muted/50 flex flex-col items-center gap-1 rounded-lg border p-3">
              <Zap className="text-primary h-5 w-5" />
              <span className="text-foreground text-2xl font-bold">{xp}</span>
              <span className="text-muted-foreground text-xs">XP</span>
            </div>
          </div>

          <Card>
            <CardContent className="space-y-3 pt-4">
              <div className="border-border bg-muted/50 flex items-center gap-2 rounded-lg border p-3">
                <Circle className="fill-primary text-primary h-4 w-4 shrink-0" />
                <span className="text-muted-foreground text-sm">Turn:</span>
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/20 text-primary"
                >
                  {turnText ?? "—"}
                </Badge>
              </div>

              {(puzzle.rating != null || puzzle.ratingDeviation != null) && (
                <div className="flex flex-wrap gap-2">
                  {puzzle.rating != null && (
                    <div className="border-border bg-muted/50 flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm">
                      <BarChart3 className="text-primary h-3.5 w-3.5" />
                      <span className="text-muted-foreground">Rating</span>
                      <span className="text-foreground font-semibold">
                        {puzzle.rating}
                      </span>
                    </div>
                  )}
                  {puzzle.ratingDeviation != null && (
                    <div className="border-border bg-muted/50 flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm">
                      <span className="text-muted-foreground">±</span>
                      <span className="text-foreground font-semibold">
                        {puzzle.ratingDeviation}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {puzzle.themes && puzzle.themes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="text-primary h-3.5 w-3.5 shrink-0" />
                  {puzzle.themes.map((theme) => (
                    <Badge
                      key={theme}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
