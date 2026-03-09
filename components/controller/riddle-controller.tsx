"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  BookOpen,
  ExternalLink,
  Flag,
  Circle,
  Lightbulb,
  Heart,
  Clock,
} from "lucide-react";
import type { GameRiddle } from "@/lib/model/game-riddle";
import type { Game } from "@/lib/model/game";
import { useStatsStore } from "@/stores/stats-store";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";
import { useUpdateGameRiddleAnswer } from "@/hooks/use-update-game-riddle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  const lives = useStatsStore((state) => state.lives);
  const { updateGameRiddleAnswerHook } = useUpdateGameRiddleAnswer();

  // ===================================================================
  // When riddle is answered correctly, redirect user back to challenge
  // page. gameType is already in the riddle. I know where they came from.
  // Controller handles this flow
  // ===================================================================
  const challengeSlug = riddle.gameType?.replace(/_/g, "-");
  const handleSolved = async (isCorrect: boolean) => {
    await updateGameRiddleAnswerHook(riddle.id, isCorrect);
    if (isCorrect && challengeSlug) {
      router.push(`/challenge/${challengeSlug}`);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="min-w-0">
          <PuzzleBoard
            sourceId={riddle.id}
            mode="riddle"
            pgn={game.pgn}
            ply={riddle.ply}
            moves={riddle.moves ?? ""}
            width={610}
            height={610}
            onSolved={handleSolved}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div className="border-border bg-muted/50 flex items-center justify-center gap-6 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Heart className="text-primary h-5 w-5" />
              <span className="text-foreground text-2xl font-bold">
                {lives}
              </span>
              <span className="text-muted-foreground text-sm">Lives</span>
            </div>
            <div className="bg-border h-10 w-px shrink-0" />
            <div className="flex items-center gap-2">
              <Clock className="text-primary h-5 w-5" />
              <CountdownTimer
                minutes={5}
                className="text-foreground text-2xl font-bold"
              />
              <span className="text-muted-foreground text-sm">Time</span>
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

              {game.opening && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      Opening
                    </span>
                    <span className="text-foreground truncate text-right font-medium">
                      {game.opening}
                    </span>
                  </div>
                </>
              )}

              {game.url && (
                <>
                  <Separator />
                  <Link
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View game
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          <Button variant="default" size="lg" className="w-full">
            <Lightbulb className="mr-2 h-4 w-4" />
            Hint
          </Button>
        </div>
      </div>
    </div>
  );
}
