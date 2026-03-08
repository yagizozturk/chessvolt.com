"use client";

import { useState, useEffect } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createRepAction } from "./actions";
import { Button } from "@/components/ui/button";
import { extractMovesFromPgn } from "@/lib/utils/pgn";
import { cn } from "@/lib/utils";

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
              "border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm font-mono shadow-xs",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            placeholder="PGN'den UCI çıkarmak için (DB'ye yazılmaz)"
            value={moveCountForAnswer}
            onChange={(e) => setMoveCountForAnswer(e.target.value)}
            className={cn(
              "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" placeholder="Repertoire başlığı" />
        </Field>
        <Field>
          <FieldLabel>Opening Name</FieldLabel>
          <Input name="openingName" placeholder="örn: Sicilian Defense" />
        </Field>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <Input
            name="moves"
            required
            value={moves}
            onChange={(e) => setMoves(e.target.value)}
            placeholder="e2e4 e7e5 g1f3 ... veya Move Count ile otomatik doldur"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Oluştur</Button>
    </form>
  );
}
