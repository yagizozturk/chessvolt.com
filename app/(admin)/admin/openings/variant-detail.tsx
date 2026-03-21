"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import VoltBoard from "@/components/volt-board/volt-board";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import {
  type PgnPairedDisplay,
  getPairedPgnDisplayFromPgn,
  getUciMovesFromPgnAfterPly,
} from "@/lib/chess/extractMovesFromPgn";
import { cn } from "@/lib/utilities/cn";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  deleteOpeningVariantAction,
  updateOpeningVariantAction,
} from "./actions";

type Props = {
  variant: OpeningVariant;
};

function PgnPairedBlock({
  display,
  className,
}: {
  display: PgnPairedDisplay;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {display.startComment ? (
        <p className="text-muted-foreground border-muted border-l-2 pl-2 text-xs whitespace-pre-wrap">
          {display.startComment}
        </p>
      ) : null}
      {display.rows.map((row, i) => (
        <div key={i} className="space-y-1">
          <p className="font-mono text-xs">
            {row.blackSan ? `${row.whiteSan} - ${row.blackSan}` : row.whiteSan}
          </p>
          {row.whiteComment || row.blackComment ? (
            <div className="text-muted-foreground border-muted space-y-1 border-l-2 pl-2 text-xs">
              {row.whiteComment ? (
                <p className="whitespace-pre-wrap">{row.whiteComment}</p>
              ) : null}
              {row.blackComment ? (
                <p className="whitespace-pre-wrap">{row.blackComment}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function FenBoardPreview({
  label,
  fen,
  sourceId,
}: {
  label: string;
  fen: string | null | undefined;
  sourceId: string;
}) {
  const trimmed = fen?.trim();
  if (!trimmed) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">{label}</p>
        <div className="border-muted bg-muted/30 text-muted-foreground flex aspect-square max-h-[320px] max-w-[320px] items-center justify-center rounded-lg border text-sm">
          —
        </div>
        <p className="text-muted-foreground font-mono text-xs break-all">—</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <VoltBoard
        sourceId={sourceId}
        mode="opening"
        initialFen={trimmed}
        moves=""
        width={320}
        height={320}
        coordinates={false}
        className="border-muted rounded-lg border"
        viewOnly
      />
      <p className="text-muted-foreground font-mono text-xs break-all">
        {trimmed}
      </p>
    </div>
  );
}

export function VariantDetail({ variant }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [pgn, setPgn] = useState(variant.pgn);
  const [ply, setPly] = useState(String(variant.ply ?? 0));
  const plyNum = parseInt(ply, 10) >= 0 ? parseInt(ply, 10) : 0;
  const derivedMoves = pgn
    ? (getUciMovesFromPgnAfterPly(pgn, plyNum) ?? variant.moves)
    : variant.moves;

  const pgnPairedDisplay = useMemo(
    () => getPairedPgnDisplayFromPgn(pgn.trim()),
    [pgn],
  );

  useEffect(() => {
    if (!isEditing) {
      setPgn(variant.pgn);
      setPly(String(variant.ply ?? 0));
    }
  }, [isEditing, variant.pgn, variant.ply]);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/admin/openings/opening/${variant.openingId}`}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to variants
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{variant.title || "Untitled Variant"}</CardTitle>
            <CardDescription>Opening: {variant.openingId}</CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={async () => {
                if (!confirm("This variant will be deleted. Are you sure?"))
                  return;
                await deleteOpeningVariantAction(variant.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <p className="text-muted-foreground mb-4 text-sm">
              Saved positions from the database. FEN edits in the form appear
              here after you save.
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              <FenBoardPreview
                label="Initial FEN"
                fen={variant.initialFen}
                sourceId={`${variant.id}-admin-initial-fen`}
              />
              <FenBoardPreview
                label="Display FEN"
                fen={variant.displayFen}
                sourceId={`${variant.id}-admin-display-fen`}
              />
            </div>
          </div>
          {isEditing ? (
            <form
              action={async (formData) => {
                await updateOpeningVariantAction(variant.id, formData);
              }}
              className="space-y-4"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel>Sort Key</FieldLabel>
                  <Input
                    name="sortKey"
                    type="number"
                    defaultValue={variant.sortKey}
                    className="font-mono"
                  />
                </Field>
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input name="title" defaultValue={variant.title ?? ""} />
                </Field>
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input
                    name="description"
                    defaultValue={variant.description ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel>Ply (başlangıç hamle indeksi)</FieldLabel>
                  <Input
                    name="ply"
                    type="number"
                    min={0}
                    value={ply}
                    onChange={(e) => setPly(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>PGN</FieldLabel>
                  <textarea
                    name="pgn"
                    value={pgn}
                    onChange={(e) => setPgn(e.target.value)}
                    required
                    rows={6}
                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-base text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  />
                  {pgnPairedDisplay &&
                  (pgnPairedDisplay.rows.length > 0 ||
                    pgnPairedDisplay.startComment) ? (
                    <PgnPairedBlock
                      display={pgnPairedDisplay}
                      className="border-muted bg-muted/20 mt-2 max-h-64 overflow-auto rounded-md border p-3"
                    />
                  ) : null}
                </Field>
                <Field>
                  <FieldLabel>Moves (UCI)</FieldLabel>
                  <Input
                    readOnly
                    value={derivedMoves}
                    className="font-mono text-sm"
                  />
                </Field>
                <Field>
                  <FieldLabel>Initial FEN</FieldLabel>
                  <Input
                    name="initialFen"
                    defaultValue={variant.initialFen ?? ""}
                    className="font-mono text-sm"
                  />
                </Field>
                <Field>
                  <FieldLabel>Display FEN</FieldLabel>
                  <Input
                    name="displayFen"
                    defaultValue={variant.displayFen ?? ""}
                    className="font-mono text-sm"
                  />
                </Field>
              </FieldGroup>
              <Button type="submit">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </form>
          ) : (
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground font-medium">ID</dt>
                <dd className="font-mono text-xs">{variant.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">
                  Opening ID
                </dt>
                <dd className="font-mono text-xs">{variant.openingId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Sort Key</dt>
                <dd className="font-mono text-xs">{variant.sortKey}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Title</dt>
                <dd>{variant.title ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">
                  Description
                </dt>
                <dd>{variant.description ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Ply</dt>
                <dd>{variant.ply ?? 0}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Moves</dt>
                <dd className="font-mono text-xs break-all">{variant.moves}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">PGN</dt>
                <dd className="space-y-2">
                  {pgnPairedDisplay &&
                  (pgnPairedDisplay.rows.length > 0 ||
                    pgnPairedDisplay.startComment) ? (
                    <PgnPairedBlock display={pgnPairedDisplay} />
                  ) : (
                    <span className="font-mono text-xs break-all">
                      {variant.pgn || "—"}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">
                  Created At
                </dt>
                <dd>{variant.createdAt}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
