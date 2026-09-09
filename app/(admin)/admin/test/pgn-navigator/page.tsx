"use client";

import { useState } from "react";

import VoltBoardNavigator from "@/components/board-navigator/volt-board-navigator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { GameReviewPanel } from "@/features/game-review/components/game-review-panel";
import { useGameReview } from "@/features/game-review/hooks/use-game-review";

export default function PgnNavigatorPage() {
  const [pgn, setPgn] = useState("");
  const [ply, setPly] = useState(0);
  const { status, error, result, criticalMoments, selectedMoment, review, selectMoment, reset } =
    useGameReview();

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">PGN Navigator</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="pgn-navigator-pgn">PGN</FieldLabel>
              <Textarea
                id="pgn-navigator-pgn"
                value={pgn}
                onChange={(event) => {
                  setPgn(event.target.value);
                  setPly(0);
                  reset();
                }}
                placeholder="Paste PGN here…"
                rows={12}
                className="font-mono text-sm"
              />
            </Field>
          </FieldGroup>

          <GameReviewPanel
            moments={criticalMoments}
            selectedPly={selectedMoment?.ply ?? null}
            isLoading={status === "loading"}
            error={error}
            hasResult={status === "success"}
            disabled={!pgn.trim()}
            onReview={() => {
              void review(pgn);
            }}
            onSelectMoment={(moment) => {
              selectMoment(moment);
              setPly(moment.ply);
            }}
          />
        </div>

        <div className="w-full max-w-[420px] shrink-0 self-start">
          <VoltBoardNavigator
            key={pgn}
            pgn={pgn}
            sourceId="pgn-navigator"
            ply={ply}
            onPlyChange={setPly}
          />
          {selectedMoment && ply === selectedMoment.ply && (
            <p className="text-muted-foreground mt-3 text-sm">
              Played <span className="text-foreground font-medium">{selectedMoment.playedSan}</span>
              {" · "}
              Best <span className="text-foreground font-medium">{selectedMoment.bestSan}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
