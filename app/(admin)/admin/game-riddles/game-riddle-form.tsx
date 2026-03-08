"use client";

import type { Game } from "@/lib/model/game";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createGameRiddleAction } from "./actions";

type Props = {
  games: Game[];
};

export function GameRiddleForm({ games }: Props) {
  return (
    <form action={createGameRiddleAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Game</FieldLabel>
          <select
            name="gameId"
            required
            className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Seçin...</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.whitePlayer} vs {g.blackPlayer} ({g.result})
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel>Ply</FieldLabel>
          <Input name="ply" type="number" required defaultValue={0} />
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required placeholder="Örn: Find the best move" />
        </Field>
        <Field>
          <FieldLabel>FEN</FieldLabel>
          <Input name="fen" placeholder="Opsiyonel" />
        </Field>
        <Field>
          <FieldLabel>Moves</FieldLabel>
          <Input name="moves" placeholder="Opsiyonel, UCI format" />
        </Field>
        <Field>
          <FieldLabel>Game Type</FieldLabel>
          <Input
            name="gameType"
            placeholder="örn: magnus_plays"
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Oluştur</Button>
    </form>
  );
}
