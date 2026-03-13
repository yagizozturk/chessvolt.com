"use client";

import { useState, useEffect } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createRepAction } from "./actions";
import { Button } from "@/components/ui/button";
import { extractMovesFromPgn } from "@/lib/chess/extractMovesFromPgn";
import { cn } from "@/lib/utilities/cn";

export function RepForm() {
  const [pgn, setPgn] = useState("");
  const [ply, setPly] = useState("0");
  const [moveCountForAnswer, setMoveCountForAnswer] = useState("");
  const [moves, setMoves] = useState("");

  useEffect(() => {
    if (!pgn?.trim() || !moveCountForAnswer) return;
    const plyNum = parseInt(ply, 10);
    const moveCount = parseInt(moveCountForAnswer, 10);
    if (isNaN(plyNum) || isNaN(moveCount) || moveCount <= 0) return;
    const uci = extractMovesFromPgn(pgn.trim(), plyNum, moveCount);
    if (uci) setMoves(uci);
  }, [pgn, ply, moveCountForAnswer]);

  return (
    <form action={createRepAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>PGN</FieldLabel>
          <textarea
            name="pgn"
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            placeholder="1. e4 e5 2. Nf3 ..."
            rows={4}
            className={cn(
              "border-input w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Ply</FieldLabel>
          <Input
            name="ply"
            type="number"
            value={ply}
            onChange={(e) => setPly(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field>
          <FieldLabel>Move Count For Answer</FieldLabel>
          <Input
            type="number"
            min={1}
            placeholder="To extract UCI from PGN (not saved to DB)"
            value={moveCountForAnswer}
            onChange={(e) => setMoveCountForAnswer(e.target.value)}
            className={cn(
              "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" placeholder="Repertoire title" />
        </Field>
        <Field>
          <FieldLabel>Opening Type</FieldLabel>
          <Input name="openingType" placeholder="e.g. e4, d4, c4" />
        </Field>
        <Field>
          <FieldLabel>Opening Name</FieldLabel>
          <Input name="openingName" placeholder="e.g. Sicilian Defense" />
        </Field>
        <Field>
          <FieldLabel>Display FEN</FieldLabel>
          <Input
            name="displayFen"
            placeholder="e.g. rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <Input
            name="moves"
            required
            value={moves}
            onChange={(e) => setMoves(e.target.value)}
            placeholder="e2e4 e7e5 g1f3 ... or auto-fill with Move Count"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Create</Button>
    </form>
  );
}
