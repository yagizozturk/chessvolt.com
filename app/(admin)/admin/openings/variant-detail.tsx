"use client";

import { useState } from "react";
import Link from "next/link";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
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
import { ArrowLeft, Trash2, Save } from "lucide-react";
import {
  updateOpeningVariantAction,
  deleteOpeningVariantAction,
} from "./actions";

type Props = {
  variant: OpeningVariant;
};

export function VariantDetail({ variant }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/openings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{variant.title || "Untitled Variant"}</CardTitle>
            <CardDescription>
              {variant.ecoCode && `${variant.ecoCode} • `}
              Opening: {variant.openingId}
            </CardDescription>
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
        <CardContent>
          {isEditing ? (
            <form
              action={async (formData) => {
                await updateOpeningVariantAction(variant.id, formData);
              }}
              className="space-y-4"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    name="title"
                    defaultValue={variant.title ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel>ECO Code</FieldLabel>
                  <Input
                    name="ecoCode"
                    defaultValue={variant.ecoCode ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel>Moves (SAN)</FieldLabel>
                  <Input
                    name="moves"
                    defaultValue={variant.moves}
                    required
                    className="font-mono text-sm"
                  />
                </Field>
                <Field>
                  <FieldLabel>FEN</FieldLabel>
                  <Input
                    name="fen"
                    defaultValue={variant.fen ?? ""}
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
                <dt className="text-muted-foreground font-medium">Title</dt>
                <dd>{variant.title ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">ECO Code</dt>
                <dd>{variant.ecoCode ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Moves</dt>
                <dd className="font-mono break-all text-xs">{variant.moves}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">PGN</dt>
                <dd className="font-mono break-all text-xs">{variant.pgn}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">FEN</dt>
                <dd className="font-mono break-all text-xs">
                  {variant.fen ?? "—"}
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
