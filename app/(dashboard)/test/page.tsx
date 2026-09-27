"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { requestChesscomGames } from "@/features/test/api/chesscom-games";
import { useChesscomGames } from "@/features/test/hooks/use-chesscom-games";

export default function TestPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { games, setGames } = useChesscomGames();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    try {
      setGames(await requestChesscomGames(trimmed));
    } catch (error) {
      console.error(error);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <FieldGroup className="flex max-w-md flex-col gap-4 sm:flex-row sm:items-end">
            <Field className="min-w-0 flex-1">
              <FieldLabel htmlFor="test-chesscom-username">Chess.com</FieldLabel>
              <Input
                id="test-chesscom-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="username"
                autoComplete="off"
              />
            </Field>
            <Button type="submit" variant="volt" disabled={isLoading}>
              {isLoading ? <Spinner data-icon="inline-start" /> : null}
              {isLoading ? "Loading…" : "Load"}
            </Button>
          </FieldGroup>
        </form>
        {games.length > 0 ? (
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {games.map((game) => (
              <li key={game.uuid}>
                <Link href={`/test/${game.uuid}`}>
                  {game.uuid} - {game.white.username} vs {game.black.username} · {game.time_class}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
