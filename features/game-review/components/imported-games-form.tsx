"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useImportedGames } from "@/features/game-review/components/imported-games-provider";

export function ImportedGamesForm() {
  const {
    chesscomUsername,
    setChesscomUsername,
    lichessUsername,
    setLichessUsername,
    isChesscomLoading,
    isLichessLoading,
    loadChesscom,
    loadLichess,
  } = useImportedGames();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void loadChesscom();
        }}
      >
        <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field className="min-w-0 flex-1">
            <FieldLabel htmlFor="analysis-chesscom-username">Chess.com</FieldLabel>
            <Input
              id="analysis-chesscom-username"
              value={chesscomUsername}
              onChange={(event) => setChesscomUsername(event.target.value)}
              placeholder="username"
              autoComplete="off"
            />
          </Field>
          <Button type="submit" variant="volt" disabled={isChesscomLoading}>
            {isChesscomLoading ? <Spinner data-icon="inline-start" /> : null}
            {isChesscomLoading ? "Loading…" : "Load games"}
          </Button>
        </FieldGroup>
      </form>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void loadLichess();
        }}
      >
        <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field className="min-w-0 flex-1">
            <FieldLabel htmlFor="analysis-lichess-username">Lichess</FieldLabel>
            <Input
              id="analysis-lichess-username"
              value={lichessUsername}
              onChange={(event) => setLichessUsername(event.target.value)}
              placeholder="username"
              autoComplete="off"
            />
          </Field>
          <Button type="submit" variant="volt" disabled={isLichessLoading}>
            {isLichessLoading ? <Spinner data-icon="inline-start" /> : null}
            {isLichessLoading ? "Loading…" : "Load games"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
