"use client";

import { deleteOpeningVariantAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { VariantEditForm } from "../edit/variant-edit-form";

type Props = {
  variant: OpeningVariant;
};

export function VariantDetail({ variant }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/admin/openings/main-opening/${variant.openingId}`}
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
            ) : null}
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
          {isEditing ? (
            <VariantEditForm
              key={variant.id}
              variant={variant}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground font-medium">ID</dt>
                <dd className="font-mono text-xs">{variant.id}</dd>
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
                <dd>
                  <span className="tabular-nums">{variant.ply ?? 0}</span>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                    Half-move index in the PGN where this line begins (0 = start
                    position). Stored UCI moves and the default initial FEN
                    match this point in the game.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Moves</dt>
                <dd className="font-mono text-xs break-all">{variant.moves}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">
                  Initial FEN
                </dt>
                <dd className="font-mono text-xs break-all">
                  {variant.initialFen || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">
                  Display FEN
                </dt>
                <dd className="font-mono text-xs break-all">
                  {variant.displayFen ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">PGN</dt>
                <dd>
                  <span className="font-mono text-xs break-all whitespace-pre-wrap">
                    {variant.pgn || "—"}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Goals</dt>
                <dd>
                  {variant.goals != null ? (
                    <pre className="bg-muted/30 max-h-64 overflow-auto rounded-md border p-3 font-mono text-xs whitespace-pre-wrap">
                      {JSON.stringify(variant.goals, null, 2)}
                    </pre>
                  ) : (
                    "—"
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
