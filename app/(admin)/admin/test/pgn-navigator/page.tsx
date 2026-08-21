"use client";

import { useState } from "react";

import VoltBoardNavigator from "@/components/board-navigator/volt-board-navigator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export default function PgnNavigatorPage() {
  const [pgn, setPgn] = useState("");

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">PGN Navigator</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <FieldGroup className="min-w-0 flex-1">
          <Field>
            <FieldLabel htmlFor="pgn-navigator-pgn">PGN</FieldLabel>
            <Textarea
              id="pgn-navigator-pgn"
              value={pgn}
              onChange={(event) => setPgn(event.target.value)}
              placeholder="Paste PGN here…"
              rows={12}
              className="font-mono text-sm"
            />
          </Field>
        </FieldGroup>

        <div className="w-full max-w-[420px] shrink-0 self-start">
          <VoltBoardNavigator key={pgn} pgn={pgn} sourceId="pgn-navigator" />
        </div>
      </div>
    </div>
  );
}
