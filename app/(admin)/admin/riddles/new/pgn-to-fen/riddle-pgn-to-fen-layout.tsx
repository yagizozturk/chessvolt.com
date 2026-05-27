"use client";

import { useEffect, useMemo, useState } from "react";

import { GOALS_JSON_EXAMPLE, VALID_PGN_EXAMPLE } from "@/app/(admin)/admin/constants/riddle-examples";
import { useUciRowsFromPgn } from "@/app/(admin)/admin/hooks/use-uci-rows-from-pgn";
import { createRiddleAction } from "@/app/(admin)/admin/riddles/actions/actions";
import { extractFenFromPgn } from "@/app/(admin)/admin/utils/extract-fen-from-pgn";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { JsonViewer } from "@/components/shared/json-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";

export function RiddlePgnToFenLayout() {
  const [pgn, setPgn] = useState("");
  const fen = useMemo(() => extractFenFromPgn(pgn), [pgn]);
  const [displayFen, setDisplayFen] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [goals, setGoals] = useState("");
  const [title, setTitle] = useState("");
  const [gameType, setGameType] = useState("");
  const [themes, setThemes] = useState("");
  const { uciMoves, error: pgnError } = useUciRowsFromPgn(pgn);
  const derivedMoves = useMemo(() => uciMoves.join(" "), [uciMoves]);
  const canSubmit = Boolean(pgn.trim()) && Boolean(derivedMoves.trim()) && !pgnError;
  const insertPreviewJson = useMemo(() => {
    let parsedGoals: unknown = null;
    if (goals.trim()) {
      try {
        parsedGoals = JSON.parse(goals);
      } catch {
        parsedGoals = "INVALID_JSON";
      }
    }

    const parsedThemes = themes
      .split(",")
      .map((theme) => theme.trim())
      .filter(Boolean);

    return JSON.stringify(
      {
        title: title.trim() || null,
        gameType: gameType.trim() || null,
        pgn: pgn.trim() || null,
        moves: derivedMoves || null,
        initialFen: fen ?? null,
        displayFen: displayFen.trim() || fen || null,
        themes: parsedThemes,
        isActive,
        goals: parsedGoals,
      },
      null,
      2,
    );
  }, [title, gameType, pgn, derivedMoves, fen, displayFen, themes, isActive, goals]);

  useEffect(() => {
    setDisplayFen(fen ?? "");
  }, [fen]);

  return (
    <form action={createRiddleAction} className="grid gap-6 lg:grid-cols-3">
      <Card className="ring-border rounded-lg ring-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>New PGN (FEN included)</CardTitle>
          <CardDescription>
            Paste your PGN here to build the riddle. The FEN is extracted from the PGN [FEN] tag. FEN is the initial
            position of the riddle. FEN is required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <FieldLabel>PGN</FieldLabel>
            <div className="relative">
              {!pgn.trim() ? (
                <pre
                  aria-hidden
                  className="border-input text-muted-foreground pointer-events-none absolute inset-0 overflow-hidden rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {VALID_PGN_EXAMPLE}
                </pre>
              ) : null}
              <textarea
                name="pgn"
                rows={16}
                value={pgn}
                onChange={(e) => setPgn(e.target.value)}
                spellCheck={false}
                className="border-input focus-visible:border-primary focus-visible:ring-primary/50 relative z-10 w-full rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              />
            </div>
            {pgnError ? <p className="text-destructive mt-1 text-sm">{pgnError}</p> : null}
          </Field>

          <Field>
            <FieldLabel>Moves (UCI, derived)</FieldLabel>
            <input type="hidden" name="moves" value={derivedMoves} />
            <Input readOnly disabled value={derivedMoves} className="font-mono text-sm" />
          </Field>
          <Field>
            <FieldLabel>Initial FEN</FieldLabel>
            <Input name="initialFen" value={fen ?? ""} readOnly disabled className="font-mono text-sm" />
          </Field>
          <Field>
            <FieldLabel>Display FEN</FieldLabel>
            <Input
              name="displayFen"
              value={displayFen}
              onChange={(e) => setDisplayFen(e.target.value)}
              placeholder="Defaults to initial FEN"
              className="font-mono text-sm"
            />
          </Field>

          <FieldGroup>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Field className="min-w-0 flex-1">
                <FieldLabel>Title</FieldLabel>
                <Input
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Find the best move"
                />
              </Field>
              <Field className="min-w-0 flex-1">
                <FieldLabel>Game Type</FieldLabel>
                <Input
                  name="gameType"
                  required
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  placeholder="e.g. legend_games"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Themes</FieldLabel>
              <Input
                name="themes"
                value={themes}
                onChange={(e) => setThemes(e.target.value)}
                placeholder="Comma-separated, e.g. tactics, endgame"
              />
            </Field>
            <Field className="flex flex-row items-center gap-2">
              <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <FieldLabel className="mb-0">Active (visible on challenge pages)</FieldLabel>
            </Field>
            <Field>
              <FieldLabel>Goals (JSON)</FieldLabel>
              <div className="relative">
                {!goals.trim() ? (
                  <pre
                    aria-hidden
                    className="border-input text-muted-foreground pointer-events-none absolute inset-0 overflow-hidden rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                  >
                    {GOALS_JSON_EXAMPLE}
                  </pre>
                ) : null}
                <textarea
                  name="goals"
                  required
                  rows={10}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  spellCheck={false}
                  className={cn(
                    "border-input focus-visible:border-primary focus-visible:ring-primary/50 relative z-10 w-full min-w-0 rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  )}
                />
              </div>
            </Field>
          </FieldGroup>

          <JsonViewer title="Last JSON to insert" data={insertPreviewJson} />

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit}>
              Insert riddle
            </Button>
          </div>
          {!canSubmit && pgn.trim() ? (
            <p className="text-muted-foreground text-xs">
              Provide a valid PGN so moves can be derived before inserting.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="ring-border rounded-lg ring-1">
        <CardHeader>
          <CardTitle>Display Board</CardTitle>
          <CardDescription>Position from PGN [FEN] tag.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <DisplayBoard sourceId="admin-new-riddle-display" initialFen={fen} size={260} coordinates={false} />
        </CardContent>
      </Card>
    </form>
  );
}
