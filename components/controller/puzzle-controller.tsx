"use client";

import type { Puzzle } from "@/lib/model/puzzle";
import PuzzleBoard from "@/components/puzzle-board/puzzle-board";
import { getNextTurnFromFen } from "@/lib/chess-board/getTurn";
import { usePuzzleStore } from "@/stores/puzzle-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Flame,
  Tag,
  BarChart3,
  Circle,
} from "lucide-react";

export default function PuzzleController({ puzzle }: { puzzle: Puzzle }) {
  const turnText = getNextTurnFromFen(puzzle.fen);
  const streak = usePuzzleStore((state) => state.streak);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: Puzzle Board */}
        <div>
          <PuzzleBoard
            puzzleId={puzzle.id}
            initialFen={puzzle.fen}
            moves={puzzle.moves}
            width={620}
            height={620}
            viewOnly={false}
          />
        </div>

        {/* Right: Stats Cards */}
        <div className="space-y-4">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Circle className="h-5 w-5 text-[#FFB800]" />
                Turn
              </CardTitle>
              <CardDescription className="text-white/60">
                Who is to move
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">
                {turnText ?? "—"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-[#FFB800]" />
                Puzzle Info
              </CardTitle>
              <CardDescription className="text-white/60">
                Difficulty and rating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {puzzle.rating != null && (
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-white/60">Rating</span>
                  <span className="font-bold text-white">{puzzle.rating}</span>
                </div>
              )}
              {puzzle.ratingDeviation != null && (
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-white/60">Deviation</span>
                  <span className="font-bold text-white">
                    ±{puzzle.ratingDeviation}
                  </span>
                </div>
              )}
              {puzzle.rating == null && puzzle.ratingDeviation == null && (
                <div className="py-2 text-sm text-white/40">
                  No rating data
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Flame className="h-5 w-5 text-orange-400" />
                Streak
              </CardTitle>
              <CardDescription className="text-white/60">
                Consecutive correct solves
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{streak}</div>
            </CardContent>
          </Card>

          {puzzle.themes && puzzle.themes.length > 0 && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Tag className="h-5 w-5 text-[#FFB800]" />
                  Themes
                </CardTitle>
                <CardDescription className="text-white/60">
                  Puzzle categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {puzzle.themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
