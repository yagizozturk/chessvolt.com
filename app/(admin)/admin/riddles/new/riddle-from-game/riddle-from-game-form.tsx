"use client";

import { useEffect, useMemo, useState } from "react";

import { GOALS_JSON_EXAMPLE } from "@/app/(admin)/admin/constants/riddle-examples";
import { createRiddleAction } from "@/app/(admin)/admin/riddles/actions/actions";
import { RiddleRatingInput } from "@/app/(admin)/admin/riddles/components/riddle-rating-input";
import VoltBoardNavigator from "@/components/board-navigator/volt-board-navigator";
import { JsonViewer } from "@/app/(admin)/admin/shared/components/json-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Collection } from "@/features/collection/types/collection";
import type { Game } from "@/features/game/types/game";
import { DEFAULT_RIDDLE_RATING } from "@/features/riddle/types/riddle-rating";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { cn } from "@/lib/utils/cn";

import { CollectionRiddleSelect } from "../../components/collection-riddle-select";

type Props = {
  games: Game[];
  collections: Collection[];
};

// ============================================================================
// Form
// Create riddle from selected game PGN + admin provided initial FEN.
// ============================================================================
export function RiddleFromGameForm({ games, collections }: Props) {
  const [selectedGameId, setSelectedGameId] = useState("");
  const [initialFen, setInitialFen] = useState("");
  const [endFen, setEndFen] = useState("");
  const [displayFen, setDisplayFen] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [goals, setGoals] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number | null>(DEFAULT_RIDDLE_RATING);
  const [themes, setThemes] = useState("");
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? "");

  const selectedGame = useMemo(() => games.find((game) => game.id === selectedGameId) ?? null, [games, selectedGameId]);
  const pgn = selectedGame?.pgn?.trim() ?? "";

  useEffect(() => {
    setDisplayFen((prev) => (prev.trim() ? prev : initialFen));
  }, [initialFen]);

  const derive = useMemo(() => {
    if (!pgn || !initialFen.trim() || !endFen.trim()) {
      return {
        moves: "",
        fenError: null as string | null,
        initialPly: null as number | null,
        endPly: null as number | null,
      };
    }

    const initialPly = getPlyFromPgnAtFen(pgn, initialFen.trim());
    if (initialPly == null) {
      return {
        moves: "",
        fenError: "Initial FEN was not found in selected game PGN.",
        initialPly: null,
        endPly: null,
      };
    }

    const endPly = getPlyFromPgnAtFen(pgn, endFen.trim());
    if (endPly == null) {
      return {
        moves: "",
        fenError: "End FEN was not found in selected game PGN.",
        initialPly,
        endPly: null,
      };
    }

    if (endPly <= initialPly) {
      return {
        moves: "",
        fenError: "End FEN must be after Initial FEN in PGN move order.",
        initialPly,
        endPly,
      };
    }

    const moveCount = endPly - initialPly;
    const moves = getUciMovesFromPgnAfterPlyAtMoveCount(pgn, initialPly, moveCount) ?? "";
    if (!moves.trim()) {
      return {
        moves: "",
        fenError: "Could not derive moves from selected game between Initial and End FEN.",
        initialPly,
        endPly,
      };
    }

    return { moves, fenError: null, initialPly, endPly };
  }, [pgn, initialFen, endFen]);

  const canSubmit =
    Boolean(selectedGameId) &&
    Boolean(title.trim()) &&
    Boolean(initialFen.trim()) &&
    Boolean(endFen.trim()) &&
    Boolean(derive.moves.trim()) &&
    Boolean(collectionId.trim()) &&
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
      description: description.trim() || null,
      rating,
      pgn: pgn || null,
      initialFen: initialFen.trim() || null,
      endFen: endFen.trim() || null,
      displayFen: displayFen.trim() || initialFen.trim() || null,
      initialPly: derive.initialPly,
      endPly: derive.endPly,
      moves: derive.moves || null,
      themes: parsedThemes,
      collectionId: collectionId.trim() || null,
      isActive,
      goals: parsedGoals,
    };
  }, [
    selectedGameId,
    title,
    description,
    rating,
    pgn,
    initialFen,
    endFen,
    displayFen,
    derive.initialPly,
    derive.endPly,
    derive.moves,
    themes,
    collectionId,
    isActive,
    goals,
  ]);

  return (
    <form action={createRiddleAction} className="grid gap-6 lg:grid-cols-2">
      <Card className="ring-border rounded-lg ring-1">
        <CardHeader>
          <CardTitle>New Riddle From Game</CardTitle>
          <CardDescription>
            Select a game, provide initial FEN, then create the riddle with derived moves.
          </CardDescription>
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
            <input
              type="hidden"
              name="moveCountForAnswer"
              value={
                derive.initialPly != null && derive.endPly != null && derive.endPly > derive.initialPly
                  ? String(derive.endPly - derive.initialPly)
                  : ""
              }
            />
            <Input readOnly disabled value={derive.moves} className="font-mono text-sm" />
            {derive.fenError ? <p className="text-destructive mt-1 text-xs">{derive.fenError}</p> : null}
          </Field>

          <FieldGroup>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Field className="min-w-0 flex-1">
                <FieldLabel>Title</FieldLabel>
                <Input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
            </div>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <textarea
                name="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary shown on collection cards"
                className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              />
            </Field>
            <RiddleRatingInput value={rating} onChange={setRating} />
            <CollectionRiddleSelect
              collections={collections}
              value={collectionId}
              onChange={setCollectionId}
            />
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
              <FieldLabel className="mb-0">Active (visible on collection pages)</FieldLabel>
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
          <CardTitle>Board Navigators</CardTitle>
          <CardDescription>Pick Initial FEN and End FEN from game positions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pgn ? (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium">Initial FEN board</p>
                <VoltBoardNavigator
                  pgn={pgn}
                  size={420}
                  sourceId={`admin-new-riddle-game-initial-${selectedGameId || "none"}`}
                  onFenChange={(fen) => setInitialFen(fen)}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">End FEN board</p>
                <VoltBoardNavigator
                  pgn={pgn}
                  size={420}
                  sourceId={`admin-new-riddle-game-end-${selectedGameId || "none"}`}
                  onFenChange={(fen) => setEndFen(fen)}
                />
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Select a game to preview positions.</p>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
