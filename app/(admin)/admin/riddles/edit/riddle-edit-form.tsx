"use client";

import { useEffect, useMemo, useState } from "react";

import { GOALS_JSON_EXAMPLE, VALID_PGN_EXAMPLE } from "@/app/(admin)/admin/constants/riddle-examples";
import { useUciRowsFromPgn } from "@/app/(admin)/admin/hooks/use-uci-rows-from-pgn";
import { updateRiddleAction } from "@/app/(admin)/admin/riddles/actions/actions";
import { RiddleRatingInput } from "@/app/(admin)/admin/riddles/components/riddle-rating-input";
import { extractFenFromPgn } from "@/app/(admin)/admin/utils/extract-fen-from-pgn";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { JsonViewer } from "@/app/(admin)/admin/shared/components/json-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Collection } from "@/features/collection/types/collection";
import type { Game } from "@/features/game/types/game";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";
import { cn } from "@/lib/utils/cn";

import { CollectionRiddleSelect } from "../components/collection-riddle-select";

type Props = {
  riddle: RiddleWithThemes;
  game: Game | null;
  collections: Collection[];
  collectionId: string;
};

// ============================================================================
// Edit Form
// Edit riddle with the same UX format as PGN-to-FEN new form.
// ============================================================================
export function RiddleEditForm({ riddle, game, collections, collectionId: initialCollectionId }: Props) {
  const initialPgn = (game?.pgn ?? riddle.moveSequence.pgn ?? "").trim();
  const [pgn, setPgn] = useState(initialPgn);
  const fen = useMemo(() => extractFenFromPgn(pgn), [pgn]);
  const [displayFen, setDisplayFen] = useState(riddle.moveSequence.displayFen ?? fen ?? "");
  const [isActive, setIsActive] = useState(riddle.isActive);
  const [goals, setGoals] = useState(
    riddle.moveSequence.goals != null ? JSON.stringify(riddle.moveSequence.goals, null, 2) : "",
  );
  const [title, setTitle] = useState(riddle.title);
  const [description, setDescription] = useState(riddle.description ?? "");
  const [rating, setRating] = useState<number | null>(riddle.rating);
  const [themes, setThemes] = useState(riddle.themeSlugs.join(", "));
  const [sourceId, setSourceId] = useState(riddle.sourceId ?? "");
  const [source, setSource] = useState(riddle.source ?? "");
  const [collectionId, setCollectionId] = useState(initialCollectionId);
  const { uciMoves, error: pgnError } = useUciRowsFromPgn(pgn);
  const derivedMoves = useMemo(() => uciMoves.join(" "), [uciMoves]);
  const canSubmit =
    Boolean(title.trim()) &&
    Boolean(pgn.trim()) &&
    Boolean(derivedMoves.trim()) &&
    !pgnError &&
    Boolean(collectionId.trim());

  useEffect(() => {
    if (!displayFen.trim()) {
      setDisplayFen(fen ?? "");
    }
  }, [fen, displayFen]);

  const updatePreviewJson = useMemo(() => {
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
      id: riddle.id,
      title: title.trim() || null,
      description: description.trim() || null,
      rating,
      pgn: pgn.trim() || null,
      moves: derivedMoves || null,
      initialFen: fen ?? null,
      displayFen: displayFen.trim() || fen || null,
      themes: parsedThemes,
      sourceId: sourceId.trim() || null,
      source: source.trim() || null,
      collectionId: collectionId.trim() || null,
      isActive,
      goals: parsedGoals,
    };
  }, [
    riddle.id,
    title,
    description,
    rating,
    pgn,
    derivedMoves,
    fen,
    displayFen,
    themes,
    sourceId,
    source,
    collectionId,
    isActive,
    goals,
  ]);

  return (
    <form action={async (formData) => updateRiddleAction(riddle.id, formData)} className="grid gap-6 lg:grid-cols-3">
      <Card className="ring-border rounded-lg ring-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Edit PGN (FEN included)</CardTitle>
          <CardDescription>
            Update PGN/FEN based fields with the same flow as insert. Moves are derived from current PGN.
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
            <Input value={fen ?? ""} readOnly disabled className="font-mono text-sm" />
            <input type="hidden" name="initialFen" value={fen ?? ""} />
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
              <FieldLabel>Themes</FieldLabel>
              <Input
                name="themes"
                value={themes}
                onChange={(e) => setThemes(e.target.value)}
                placeholder="Comma-separated, e.g. tactics, endgame"
              />
            </Field>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Field className="min-w-0 flex-1">
                <FieldLabel>Source</FieldLabel>
                <Input
                  name="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. lichess"
                />
              </Field>
              <Field className="min-w-0 flex-1">
                <FieldLabel>Source ID</FieldLabel>
                <Input
                  name="sourceId"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  placeholder="External puzzle ID"
                />
              </Field>
            </div>
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
                    "border-input focus-visible:border-primary focus-visible:ring-primary/50 relative z-10 w-full min-w-0 rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  )}
                />
              </div>
            </Field>
          </FieldGroup>

          <input type="hidden" name="gameId" value={riddle.gameId ?? ""} />
          <input type="hidden" name="initialPly" value="0" />
          <input type="hidden" name="displayPly" value="0" />
          <input type="hidden" name="moveCountForAnswer" value={String(Math.max(1, uciMoves.length))} />

          <JsonViewer title="Last JSON to update" data={updatePreviewJson} />

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit}>
              Update riddle
            </Button>
          </div>
          {!canSubmit && pgn.trim() ? (
            <p className="text-muted-foreground text-xs">
              Provide a valid PGN so moves can be derived before updating.
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
          <DisplayBoard sourceId={`admin-edit-riddle-${riddle.id}`} initialFen={fen} size={260} coordinates={false} />
        </CardContent>
      </Card>
    </form>
  );
}
