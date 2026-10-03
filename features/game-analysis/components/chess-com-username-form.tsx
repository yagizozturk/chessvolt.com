"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";

type ChessComUsernameFormProps = {
  image: string;
  title: string;
  description: string;
  chessComUsername: string;
  isLoading: boolean;
  setChessComUsername: (username: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ChessComUsernameForm({
  image,
  title,
  description,
  chessComUsername,
  isLoading,
  setChessComUsername,
  onSubmit,
}: ChessComUsernameFormProps) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        void onSubmit(event);
      }}
    >
      <Image src={image} alt="" width={120} height={64} className="h-16 w-auto object-contain" />
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Field className="min-w-0 flex-1">
          <FieldLabel htmlFor="chesscom-username" className="sr-only">
            {title} username
          </FieldLabel>
          <Input
            id="chesscom-username"
            value={chessComUsername}
            onChange={(event) => setChessComUsername(event.target.value)}
            placeholder="username"
            autoComplete="on"
          />
        </Field>
        <Button type="submit" variant="volt" disabled={isLoading}>
          {isLoading ? <Spinner data-icon="inline-start" /> : null}
          {isLoading ? "Loading…" : "Load"}
        </Button>
      </FieldGroup>
    </form>
  );
}
