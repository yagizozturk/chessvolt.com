"use client";

import Link from "next/link";
import {
  User,
  Calendar,
  Trophy,
  BookOpen,
  ExternalLink,
  Flag,
  Circle,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import type { GameRiddle } from "@/lib/model/game-riddle";
import type { Game } from "@/lib/model/game";
import RiddleBoard from "@/components/riddle-board/riddle-board";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  const turn = riddle.ply % 2 === 0 ? "White" : "Black";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="min-w-0">
          <RiddleBoard
            gameRiddleId={riddle.id}
            pgn={game.pgn}
            ply={riddle.ply}
            moves={riddle.moves ?? ""}
            width={610}
            height={610}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {riddle.title}
              </CardTitle>
              <CardDescription>
                The game this puzzle is based on
              </CardDescription>
              <div className="flex items-center gap-2 pt-2">
                <Trophy className="text-primary h-4 w-4" />
                <span className="text-muted-foreground text-sm font-medium">
                  Game Info
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
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-border bg-muted/50 flex items-center gap-3 rounded-lg border p-3">
                  <div className="bg-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                    <User className="text-primary h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-medium">
                      White
                    </p>
                    <p className="text-foreground truncate font-medium">
                      {game.whitePlayer}
                    </p>
                  </div>
                </div>
                <div className="border-border bg-muted/50 flex items-center gap-3 rounded-lg border p-3">
                  <div className="bg-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                    <User className="text-primary h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-medium">
                      Black
                    </p>
                    <p className="text-foreground truncate font-medium">
                      {game.blackPlayer}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5" />
                    Result
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/20 text-primary"
                  >
                    {game.result}
                  </Badge>
                </div>
                {game.event && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Flag className="h-3.5 w-3.5" />
                      Event
                    </span>
                    <span className="text-foreground truncate font-medium">
                      {game.event}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Date
                  </span>
                  <span className="text-foreground font-medium">
                    {formatDate(game.playedAt)}
                  </span>
                </div>
                {game.opening && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      Opening
                    </span>
                    <span className="text-foreground truncate text-right font-medium">
                      {game.opening}
                    </span>
                  </div>
                )}
              </div>

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

          <Button variant="outline" size="lg" className="w-full">
            <Lightbulb className="mr-2 h-4 w-4" />
            Hint
          </Button>

          <Button variant="outline" size="lg" className="w-full" disabled>
            Next Chapter
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
