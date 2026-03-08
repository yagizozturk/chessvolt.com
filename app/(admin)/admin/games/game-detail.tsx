"use client";

import { useState } from "react";
import Link from "next/link";
import type { Game } from "@/lib/model/game";
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
import { updateGameAction, deleteGameAction } from "./actions";
import { cn } from "@/lib/utils";

type Props = {
  game: Game;
};

export function GameDetail({ game }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/games" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Listeye Dön
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {game.whitePlayer} vs {game.blackPlayer}
            </CardTitle>
            <CardDescription>{game.result}</CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Düzenle
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                İptal
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={async () => {
                if (!confirm("Bu oyun silinecek. Emin misiniz?")) return;
                await deleteGameAction(game.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Sil
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form
              action={async (formData) => {
                await updateGameAction(game.id, formData);
              }}
              className="space-y-4"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel>White Player</FieldLabel>
                  <Input
                    name="whitePlayer"
                    defaultValue={game.whitePlayer}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Black Player</FieldLabel>
                  <Input
                    name="blackPlayer"
                    defaultValue={game.blackPlayer}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Result</FieldLabel>
                  <Input name="result" defaultValue={game.result} required />
                </Field>
                <Field>
                  <FieldLabel>Played At</FieldLabel>
                  <Input
                    name="playedAt"
                    type="datetime-local"
                    defaultValue={
                      game.playedAt
                        ? new Date(game.playedAt).toISOString().slice(0, 16)
                        : ""
                    }
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>PGN</FieldLabel>
                  <textarea
                    name="pgn"
                    defaultValue={game.pgn}
                    required
                    rows={8}
                    className={cn(
                      "border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>URL</FieldLabel>
                  <Input name="url" defaultValue={game.url ?? ""} />
                </Field>
                <Field>
                  <FieldLabel>Event</FieldLabel>
                  <Input name="event" defaultValue={game.event ?? ""} />
                </Field>
                <Field>
                  <FieldLabel>Opening</FieldLabel>
                  <Input name="opening" defaultValue={game.opening ?? ""} />
                </Field>
              </FieldGroup>
              <Button type="submit">
                <Save className="h-4 w-4" />
                Kaydet
              </Button>
            </form>
          ) : (
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">ID</dt>
                <dd className="font-mono text-xs">{game.id}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">White</dt>
                <dd>{game.whitePlayer}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Black</dt>
                <dd>{game.blackPlayer}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Result</dt>
                <dd>{game.result}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Played At</dt>
                <dd>{game.playedAt}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">PGN</dt>
                <dd className="max-h-32 overflow-auto break-all font-mono text-xs">
                  {game.pgn}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">URL</dt>
                <dd className="break-all">{game.url ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Event</dt>
                <dd>{game.event ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Opening</dt>
                <dd>{game.opening ?? "—"}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
