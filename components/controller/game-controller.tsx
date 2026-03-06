"use client";

import ButtonPrimary from "@/components/ui/button-primary";
import DifficultySelector from "@/components/difficulty-selector/difficulty-selector";
import PieceColorSelector from "@/components/piece-color-selector/piece-color-selector";
import InactivePlayBoard from "@/components/play-board/inactive-play-board";
import PlayBoard from "@/components/play-board/play-board";
import CoachStockfish from "@/components/coach-stockfish/coach-stockfish";
import { useGameStore } from "@/stores/game-store";
import Card from "../card/card";
import styles from "@/styles/pages/play.module.css";

export default function GameController() {
  const isGameStarted = useGameStore((state) => state.isGameStarted);
  const setIsGameStarted = useGameStore((state) => state.setIsGameStarted);

  return (
    <main className={styles.main}>
      {/* LEFT */}
      <aside className={styles.aside}>
        <Card title="Progress" />
      </aside>

      <section className={styles.section}>
        <div className="flex">
          {!isGameStarted && <InactivePlayBoard />}
          {isGameStarted && <PlayBoard />}
          
        </div>
      </section>

      <aside className={styles.aside}>
      <div className="flex flex-col gap-y-10 rounded-lg">
            {isGameStarted && <CoachStockfish />}
            {!isGameStarted && (
              <>
                <DifficultySelector />
                <PieceColorSelector />
                <div className="mt-auto">
                  <ButtonPrimary
                    type="button"
                    text="Play Game"
                    onClick={() => setIsGameStarted(true)}
                  />
                </div>
              </>
            )}
          </div>
      </aside>
    </main>
  );
}
