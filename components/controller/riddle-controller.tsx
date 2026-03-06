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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="min-w-0 md:col-span-3">
          <RiddleBoard
            gameRiddleId={riddle.id}
            pgn={game.pgn}
            ply={riddle.ply}
            moves={riddle.moves ?? ""}
            width={620}
            height={620}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 md:col-span-9">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">
                {riddle.title}
              </CardTitle>
              <CardDescription className="text-white/60">
                The game this puzzle is based on
              </CardDescription>
              <div className="flex items-center gap-2 pt-2">
                <Trophy className="h-4 w-4 text-[#FFB800]" />
                <span className="text-sm font-medium text-white/80">
                  Game Info
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                <Circle className="h-4 w-4 shrink-0 fill-[#FFB800] text-[#FFB800]" />
                <span className="text-sm text-white/60">Turn:</span>
                <Badge className="border-[#F69E0B]/30 bg-[#F69E0B]/20 text-[#FFB800]">
                  {turn} to move
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F69E0B]/20">
                    <User className="h-4 w-4 text-[#FFB800]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white/60">White</p>
                    <p className="truncate font-medium text-white">
                      {game.whitePlayer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F69E0B]/20">
                    <User className="h-4 w-4 text-[#FFB800]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white/60">Black</p>
                    <p className="truncate font-medium text-white">
                      {game.blackPlayer}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/20" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white/60">
                    <Trophy className="h-3.5 w-3.5" />
                    Result
                  </span>
                  <Badge className="border-[#F69E0B]/30 bg-[#F69E0B]/20 text-[#FFB800]">
                    {game.result}
                  </Badge>
                </div>
                {game.event && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/60">
                      <Flag className="h-3.5 w-3.5" />
                      Event
                    </span>
                    <span className="truncate font-medium text-white">
                      {game.event}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white/60">
                    <Calendar className="h-3.5 w-3.5" />
                    Date
                  </span>
                  <span className="font-medium text-white">
                    {formatDate(game.playedAt)}
                  </span>
                </div>
                {game.opening && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/60">
                      <BookOpen className="h-3.5 w-3.5" />
                      Opening
                    </span>
                    <span className="truncate text-right font-medium text-white">
                      {game.opening}
                    </span>
                  </div>
                )}
              </div>

              {game.url && (
                <>
                  <Separator className="bg-white/20" />
                  <Link
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-[#FFB800] hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View game
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
