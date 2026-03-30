"use client";

import VoltBoard from "@/components/volt-board/volt-board";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { useState } from "react";

const SAMPLE = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`;

export default function PgnMoveSelectorPage() {
  const [pgn, setPgn] = useState(SAMPLE);

  const fen = getFenFromPgnAtPly(pgn, 0);

  return (
    <div className="container mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-lg font-semibold tracking-tight">PGN → board</h1>
      <p className="text-muted-foreground text-sm">
        PGN’deki tüm hamleler uygulanır; tahta son pozisyonu gösterir.
      </p>
      <textarea
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
        spellCheck={false}
        className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-40 w-full rounded-md border bg-transparent p-3 font-mono text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        placeholder="Paste PGN…"
      />
      {fen === null ? (
        <p className="text-destructive text-sm">Could not compute FEN</p>
      ) : null}
      <div className="flex justify-center">
        <VoltBoard
          key={fen}
          sourceId={`pgn-move-selector-${fen?.slice(0, 48)}`}
          mode="opening"
          initialFen={fen}
          moves=""
          width={480}
          height={480}
          viewOnly
          coordinates
          className="border-muted rounded-lg border"
        />
      </div>
    </div>
  );
}
