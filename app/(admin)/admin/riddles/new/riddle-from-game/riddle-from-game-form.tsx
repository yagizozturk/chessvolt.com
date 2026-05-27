"use client";

import { useEffect, useMemo, useState } from "react";

import { GOALS_JSON_EXAMPLE } from "@/app/(admin)/admin/constants/riddle-examples";
import { createRiddleAction } from "@/app/(admin)/admin/riddles/actions/actions";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { JsonViewer } from "@/components/shared/json-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Game } from "@/features/game/types/game";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { cn } from "@/lib/utils/cn";

type Props = {
  games: Game[];
};

// ============================================================================
// Form
// Create riddle from selected game PGN + admin provided initial FEN.
// ============================================================================
export function RiddleFromGameForm({ games }: Props) {
  const [selectedGameId, setSelectedGameId] = useState("");
  const [initialFen, setInitialFen] = useState("");
  const [displayFen, setDisplayFen] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [goals, setGoals] = useState("");
  const [title, setTitle] = useState("");
  const [gameType, setGameType] = useState("");
  const [themes, setThemes] = useState("");

  const selectedGame = useMemo(() => games.find((game) => game.id === selectedGameId) ?? null, [games, selectedGameId]);
  const pgn = selectedGame?.pgn?.trim() ?? "";

  useEffect(() => {
    setDisplayFen((prev) => (prev.trim() ? prev : initialFen));
  }, [initialFen]);

  const derive = useMemo(() => {
    if (!pgn || !initialFen.trim()) {
      return { moves: "", fenError: null as string | null };
    }

    const ply = getPlyFromPgnAtFen(pgn, initialFen.trim());
    if (ply == null) {
      return { moves: "", fenError: "Initial FEN was not found in selected game PGN." };
    }

    const moves = getUciMovesFromPgnAfterPly(pgn, ply) ?? "";
    if (!moves.trim()) {
      return { moves: "", fenError: "Could not derive moves from selected game and initial FEN." };
    }

    return { moves, fenError: null };
  }, [pgn, initialFen]);

  const canSubmit =
    Boolean(selectedGameId) &&
    Boolean(title.trim()) &&
    Boolean(gameType.trim()) &&
    Boolean(initialFen.trim()) &&
    Boolean(derive.moves.trim()) &&
    !derive.fenError;

  const previewJson = useMemo(() => {
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

    return {
      gameId: selectedGameId || null,
      title: title.trim() || null,
      gameType: gameType.trim() || null,
      pgn: pgn || null,
      initialFen: initialFen.trim() || null,
      displayFen: displayFen.trim() || initialFen.trim() || null,
      moves: derive.moves || null,
      themes: parsedThemes,
      isActive,
      goals: parsedGoals,
    };
  }, [selectedGameId, title, gameType, pgn, initialFen, displayFen, derive.moves, themes, isActive, goals]);

  return (
    <form action={createRiddleAction} className="grid gap-6 lg:grid-cols-3">
      <Card className="ring-border rounded-lg ring-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>New Riddle From Game</CardTitle>
          <CardDescription>Select a game, provide initial FEN, then create the riddle with derived moves.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <FieldLabel>Game</FieldLabel>
            <Combobox value={selectedGameId} onValueChange={(value) => setSelectedGameId(value ?? "")}>
              <ComboboxInput placeholder="Select a game..." aria-label="Select game" showClear className="w-full" />
              <ComboboxContent>
                <ComboboxEmpty>No game found.</ComboboxEmpty>
                <ComboboxList>
                  {games.map((game) => (
                    <ComboboxItem key={game.id} value={game.id}>
                      {game.whitePlayer} vs {game.blackPlayer} ({game.result})
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <input type="hidden" name="gameId" value={selectedGameId} />
            <input type="hidden" name="pgn" value={pgn} />
          </Field>

          <Field>
            <FieldLabel>PGN (from selected game)</FieldLabel>
            <textarea
              rows={10}
              value={pgn}
              readOnly
              className="border-input text-muted-foreground w-full rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-xs"
            />
          </Field>

          <Field>
            <FieldLabel>Moves (UCI, derived)</FieldLabel>
            <input type="hidden" name="moves" value={derive.moves} />
            <Input readOnly disabled value={derive.moves} className="font-mono text-sm" />
            {derive.fenError ? <p className="text-destructive mt-1 text-xs">{derive.fenError}</p> : null}
          </Field>

          <FieldGroup>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Field className="min-w-0 flex-1">
                <FieldLabel>Title</FieldLabel>
                <Input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <Field className="min-w-0 flex-1">
                <FieldLabel>Game Type</FieldLabel>
                <Input name="gameType" required value={gameType} onChange={(e) => setGameType(e.target.value)} />
              </Field>
            </div>
            <Field>
              <FieldLabel>Initial FEN (admin input)</FieldLabel>
              <Input
                name="initialFen"
                required
                value={initialFen}
                onChange={(e) => setInitialFen(e.target.value)}
                className="font-mono text-sm"
              />
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
                    "border-input focus-visible:border-primary focus-visible:ring-primary/50 relative z-10 w-full min-w-0 rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none",
                  )}
                />
              </div>
            </Field>
          </FieldGroup>

          <JsonViewer title="Last JSON to insert" data={previewJson} />

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit}>
              Insert riddle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="ring-border rounded-lg ring-1">
        <CardHeader>
          <CardTitle>Display Board</CardTitle>
          <CardDescription>Preview from display FEN (or initial FEN).</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <DisplayBoard
            sourceId={`admin-new-riddle-game-${selectedGameId || "none"}`}
            initialFen={(displayFen.trim() || initialFen.trim()) || undefined}
            size={260}
            coordinates={false}
          />
        </CardContent>
      </Card>
    </form>
  );
}
