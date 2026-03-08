"use client";

import Link from "next/link";
import type { Rep } from "@/lib/model/reps";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteRepAction } from "./actions";

type Props = {
  reps: Rep[];
};

export function RepsList({ reps }: Props) {
  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Bu repertoire silinecek. Emin misiniz?")) return;
    await deleteRepAction(id);
  }

  if (reps.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Henüz repertoire yok.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {reps.map((r) => (
        <Link
          key={r.id}
          href={`/admin/reps/${r.id}`}
          className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <span className="font-medium">{r.title || "İsimsiz Repertoire"}</span>
            {r.openingName && (
              <span className="rounded bg-muted px-2 py-0.5 text-xs">
                {r.openingName}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => handleDelete(e, r.id)}
            title="Sil"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
}
