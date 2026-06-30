"use client";

import { useActionState } from "react";

import {
  chessComTestAction,
  type ChessComTestFormState,
} from "@/app/(admin)/admin/chess-com/actions/test-chess-com";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: ChessComTestFormState = { error: null, action: null, result: null };

export function ChessComTestForm() {
  const [state, formAction, isPending] = useActionState(chessComTestAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div
          className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      {state.result ? (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">
          <p className="mb-2 font-medium">Result ({state.action})</p>
          <pre className="max-h-96 overflow-auto rounded-md bg-black/5 p-3 text-xs">
            {JSON.stringify(state.result, null, 2)}
          </pre>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Player</CardTitle>
          <CardDescription>
            Chess.com PubAPI requests include a custom User-Agent header to avoid rate limiting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input name="username" placeholder="hikaru" required />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archives &amp; latest games</CardTitle>
          <CardDescription>
            List archive URLs or fetch the most recent month in one chained call.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="submit" name="action" value="archives" disabled={isPending}>
            {isPending ? "Loading…" : "Get archives"}
          </Button>
          <Button type="submit" name="action" value="latest-games" disabled={isPending} variant="secondary">
            {isPending ? "Loading…" : "Get latest month games"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Games by archive URL</CardTitle>
          <CardDescription>
            Paste a month URL from the archives list (e.g. …/games/2024/12).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Archive URL</FieldLabel>
            <Input
              name="archiveUrl"
              placeholder="https://api.chess.com/pub/player/hikaru/games/2024/12"
              className="font-mono text-xs"
            />
          </Field>
          <Button type="submit" name="action" value="games-by-month" disabled={isPending}>
            {isPending ? "Loading…" : "Get games by month"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly PGN</CardTitle>
          <CardDescription>Fetch the raw PGN export for a specific year and month.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Year</FieldLabel>
              <Input name="year" placeholder="2024" />
            </Field>
            <Field>
              <FieldLabel>Month</FieldLabel>
              <Input name="month" placeholder="12" />
            </Field>
          </div>
          <Button type="submit" name="action" value="pgn" disabled={isPending}>
            {isPending ? "Loading…" : "Get PGN"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
