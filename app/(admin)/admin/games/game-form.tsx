"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createGameAction } from "./actions";
import { cn } from "@/lib/utils";

export function GameForm() {
  return (
    <form action={createGameAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>White Player</FieldLabel>
          <Input name="whitePlayer" required placeholder="örn: Magnus Carlsen" />
        </Field>
        <Field>
          <FieldLabel>Black Player</FieldLabel>
          <Input name="blackPlayer" required placeholder="örn: Fabiano Caruana" />
        </Field>
        <Field>
          <FieldLabel>Result</FieldLabel>
          <Input
            name="result"
            required
            placeholder="örn: 1-0, 0-1, 1/2-1/2"
          />
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
            placeholder="Oyunun PGN formatı"
            className={cn(
              "border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />
        </Field>
        <Field>
          <FieldLabel>URL</FieldLabel>
          <Input name="url" placeholder="Opsiyonel" />
        </Field>
        <Field>
          <FieldLabel>Event</FieldLabel>
          <Input name="event" placeholder="Opsiyonel" />
        </Field>
        <Field>
          <FieldLabel>Opening</FieldLabel>
          <Input name="opening" placeholder="Opsiyonel" />
        </Field>
      </FieldGroup>
      <Button type="submit">Oluştur</Button>
    </form>
  );
}
