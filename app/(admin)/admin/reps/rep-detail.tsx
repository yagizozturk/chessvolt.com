"use client";

import { useState } from "react";
import Link from "next/link";
import type { Rep } from "@/lib/model/reps";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { updateRepAction, deleteRepAction } from "./actions";

type Props = {
  rep: Rep;
};

export function RepDetail({ rep }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/reps" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{rep.title || "Untitled Repertoire"}</CardTitle>
            <CardDescription>
              {rep.openingName ?? "—"} • Ply: {rep.ply ?? "—"}
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
                if (!confirm("This repertoire will be deleted. Are you sure?")) return;
                await deleteRepAction(rep.id);
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
                await updateRepAction(rep.id, formData);
              }}
              className="space-y-4"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input name="title" defaultValue={rep.title} />
                </Field>
                <Field>
                  <FieldLabel>Opening Name</FieldLabel>
                  <Input
                    name="openingName"
                    defaultValue={rep.openingName ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel>Moves (UCI)</FieldLabel>
                  <Input name="moves" defaultValue={rep.moves} required />
                </Field>
                <Field>
                  <FieldLabel>Ply</FieldLabel>
                  <Input
                    name="ply"
                    type="number"
                    defaultValue={rep.ply ?? ""}
                  />
                </Field>
                <Field>
                  <FieldLabel>PGN</FieldLabel>
                  <Input
                    name="pgn"
                    defaultValue={rep.pgn ?? ""}
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
                <dt className="font-medium text-muted-foreground">ID</dt>
                <dd className="font-mono text-xs">{rep.id}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Title</dt>
                <dd>{rep.title || "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Opening Name</dt>
                <dd>{rep.openingName ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Ply</dt>
                <dd>{rep.ply ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Moves</dt>
                <dd className="break-all font-mono text-xs">{rep.moves}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">PGN</dt>
                <dd className="break-all font-mono text-xs max-h-32 overflow-y-auto">
                  {rep.pgn ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Created At</dt>
                <dd>{rep.createdAt}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
