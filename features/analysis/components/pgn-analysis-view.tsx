"use client";

import { useMemo, useState } from "react";

import VoltBoardNavigator from "@/components/board-navigator/volt-board-navigator";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { usePgnGameAnalysis } from "@/features/analysis/hooks/use-pgn-game-analysis";
import { verdictAccent } from "@/features/analysis/lib/verdict-accent";
import { summarizeMultipvLines } from "@/lib/engine/summarizeMultipv";
import { cn } from "@/lib/utils";

const EXAMPLE_PGN = `[Event "Sample"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *`;

export function PgnAnalysisView() {
  const [pgn, setPgn] = useState("");
  const [analyzedPgn, setAnalyzedPgn] = useState("");
  const [ply, setPly] = useState(0);
  const { moves, analyzing, progress, error, analyze, cancel, reset } =
    usePgnGameAnalysis();

  const selectedMove = useMemo(() => {
    if (!moves || ply <= 0) return null;
    return moves[ply - 1] ?? null;
  }, [moves, ply]);

  const multipvRows = useMemo(
    () => summarizeMultipvLines(selectedMove?.fenAfterInfos ?? []),
    [selectedMove],
  );

  const progressPct =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  async function handleAnalyze() {
    const trimmed = pgn.trim();
    if (!trimmed) return;
    setPly(0);
    setAnalyzedPgn(trimmed);
    await analyze(trimmed);
  }

  function handleReset() {
    reset();
    setAnalyzedPgn("");
    setPly(0);
  }

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">PGN Analysis</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Paste a game, run Stockfish on every move, then browse grades and
          MultiPV lines.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="analysis-pgn">PGN</FieldLabel>
          <Textarea
            id="analysis-pgn"
            value={pgn}
            onChange={(event) => setPgn(event.target.value)}
            placeholder={EXAMPLE_PGN}
            rows={8}
            className="font-mono text-sm"
            disabled={analyzing}
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          {analyzing ? (
            <Button type="button" variant="outline" onClick={cancel}>
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => void handleAnalyze()}
              disabled={!pgn.trim()}
            >
              Analyze
            </Button>
          )}
          {(moves || error) && !analyzing ? (
            <Button type="button" variant="ghost" onClick={handleReset}>
              Clear results
            </Button>
          ) : null}
        </div>
      </FieldGroup>

      {analyzing ? (
        <div className="flex flex-col gap-2">
          <Progress value={progressPct} className="h-2" />
          <p className="text-muted-foreground text-xs">
            Analyzing move {progress?.done ?? 0} of {progress?.total || "…"}…
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {moves && analyzedPgn ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="w-full max-w-[420px] shrink-0 self-start">
            <VoltBoardNavigator
              key={analyzedPgn}
              pgn={analyzedPgn}
              sourceId="pgn-analysis"
              ply={ply}
              onPlyChange={setPly}
            />
          </div>

          <div className="bg-muted/40 min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border p-3 text-sm">
            <div className="mb-3 max-h-48 overflow-auto rounded-md border border-border/80 bg-background/80 p-2">
              <div className="flex flex-wrap gap-1">
                {moves.map((move, index) => {
                  const movePly = move.ply;
                  const isWhite = movePly % 2 === 1;
                  const moveNumber = Math.ceil(movePly / 2);
                  const selected = ply === movePly;

                  return (
                    <span key={move.ply} className="inline-flex items-center">
                      {isWhite ? (
                        <span className="text-muted-foreground mr-1 font-mono text-[11px] tabular-nums">
                          {moveNumber}.
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setPly(movePly)}
                        className={cn(
                          "rounded px-1.5 py-0.5 font-mono text-xs transition-colors",
                          verdictAccent(move.verdict.kind),
                          selected
                            ? "bg-primary/15 ring-1 ring-primary/40"
                            : "hover:bg-muted",
                        )}
                      >
                        {move.san}
                      </button>
                      {index < moves.length - 1 && !isWhite ? (
                        <span className="w-1" />
                      ) : null}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mb-3 rounded-md border border-border/80 bg-background/80 p-3 font-sans">
              {ply === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Starting position — select a move to see its grade.
                </p>
              ) : selectedMove ? (
                <div className="flex flex-col gap-1">
                  <p
                    className={cn(
                      "text-lg font-semibold tracking-tight",
                      verdictAccent(selectedMove.verdict.kind),
                    )}
                  >
                    {selectedMove.verdict.label}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Approx. loss: ~
                    {Math.round(selectedMove.verdict.lossCpApprox)} cp · Engine
                    best before:{" "}
                    <span className="text-foreground font-mono">
                      {selectedMove.engineBestUciFromBefore || "—"}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No move data.</p>
              )}
            </div>

            <p className="text-muted-foreground mb-1 font-sans text-xs">
              Best reply in this position:{" "}
              <span className="text-foreground font-mono">
                {selectedMove?.fenAfterBestmove || "—"}
              </span>
            </p>
            <p className="text-muted-foreground mb-3 font-sans text-xs leading-relaxed">
              Table scores are for the{" "}
              <strong className="text-foreground font-medium">
                side to move
              </strong>{" "}
              (positive = favourable).
            </p>

            {multipvRows.length === 0 ? (
              <p className="text-muted-foreground font-sans text-xs">
                {ply === 0
                  ? "No MultiPV until a move is selected."
                  : "No MultiPV lines for this position."}
              </p>
            ) : (
              <div className="max-h-[min(480px,50vh)] overflow-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-muted-foreground py-1.5 pr-2 font-medium">
                        #
                      </th>
                      <th className="text-muted-foreground py-1.5 pr-2 font-medium">
                        Score
                      </th>
                      <th className="text-muted-foreground py-1.5 pr-2 font-medium">
                        Depth
                      </th>
                      <th className="text-muted-foreground py-1.5 pr-2 font-medium">
                        First
                      </th>
                      <th className="text-muted-foreground py-1.5 font-medium">
                        Variation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {multipvRows.map((row) => (
                      <tr key={row.rank} className="border-b border-border/60">
                        <td className="py-2 pr-2 font-mono tabular-nums">
                          {row.rank}
                        </td>
                        <td className="py-2 pr-2 font-mono tabular-nums">
                          {row.scoreLabel}
                        </td>
                        <td className="py-2 pr-2 font-mono tabular-nums">
                          {row.depth}
                        </td>
                        <td className="py-2 pr-2 font-mono text-[11px]">
                          {row.firstUci ?? "—"}
                        </td>
                        <td className="text-muted-foreground py-2 font-mono text-[11px] break-all">
                          {row.pvPreview}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
