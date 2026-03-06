"use client";

import type { GameRiddle } from "@/lib/model/game-riddle";
import type { Game } from "@/lib/model/game";
import RiddleBoard from "@/components/riddle-board/riddle-board";

type RiddleControllerProps = {
  riddle: GameRiddle;
  game: Game;
};

export default function RiddleController({ riddle, game }: RiddleControllerProps) {
  return (
    <div className="flex gap-8">
      <RiddleBoard
        gameRiddleId={riddle.id}
        pgn={game.pgn}
        ply={riddle.ply}
        moves={riddle.moves ?? ""}
        width={620}
        height={620}
      />
      <div className="flex-1">
        <h1 className="mb-4 text-2xl font-bold">{riddle.title}</h1>

        <div className="mt-4 grid grid-cols-2 gap-4"></div>
        <div className="mt-4"></div>
      </div>
    </div>
  );
}
