"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createGameAction } from "./actions";
import { cn } from "@/lib/utilities/cn";

export function GameForm() {
  return (
    <form action={createGameAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>White Player</FieldLabel>
          <Input
            name="whitePlayer"
            required
            placeholder="e.g. Magnus Carlsen"
          />
        </Field>
        <Field>
          <FieldLabel>Black Player</FieldLabel>
          <Input
            name="blackPlayer"
            required
            placeholder="e.g. Fabiano Caruana"
          />
        </Field>
        <Field>
          <FieldLabel>Result</FieldLabel>
          <Input name="result" required placeholder="e.g. 1-0, 0-1, 1/2-1/2" />
        </Field>
        <Field>
          <FieldLabel>Played At</FieldLabel>
          <Input name="playedAt" type="datetime-local" required />
        </Field>
        <Field>
          <FieldLabel>PGN</FieldLabel>
          <textarea
            name="pgn"
            required
            rows={8}
            placeholder="Game PGN format"
            className={cn(
              "border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </Field>
        <Field>
          <FieldLabel>URL</FieldLabel>
          <Input name="url" placeholder="Optional" />
        </Field>
        <Field>
          <FieldLabel>Event</FieldLabel>
          <Input name="event" placeholder="Optional" />
        </Field>
        <Field>
          <FieldLabel>Opening</FieldLabel>
          <Input name="opening" placeholder="Optional" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input name="description" placeholder="Optional" />
        </Field>
      </FieldGroup>
      <Button type="submit">Create</Button>
    </form>
  );
}
