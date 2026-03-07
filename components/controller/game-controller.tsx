"use client";

import DifficultySelector from "@/components/difficulty-selector/difficulty-selector";
import PieceColorSelector from "@/components/piece-color-selector/piece-color-selector";
import InactivePlayBoard from "@/components/play-board/inactive-play-board";
import PlayBoard from "@/components/play-board/play-board";
import CoachStockfish from "@/components/coach-stockfish/coach-stockfish";
import { useGameStore } from "@/stores/game-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GameController() {
  const isGameStarted = useGameStore((state) => state.isGameStarted);
  const setIsGameStarted = useGameStore((state) => state.setIsGameStarted);

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <section className="min-w-0">
          <div className="flex">
            {!isGameStarted && <InactivePlayBoard />}
            {isGameStarted && <PlayBoard />}
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-4">
          {isGameStarted && <CoachStockfish />}
          {!isGameStarted && (
            <Card className="border-border bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Difficulty
                  </p>
                  <DifficultySelector />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Play as
                  </p>
                  <PieceColorSelector />
                </div>
                <Button
                  onClick={() => setIsGameStarted(true)}
                  size="lg"
                  className="mt-4 w-full"
                >
                  Play Game
                </Button>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </main>
  );
}
