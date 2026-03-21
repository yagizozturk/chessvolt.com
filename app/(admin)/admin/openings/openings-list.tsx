"use client";

import Link from "next/link";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { deleteOpeningVariantAction } from "./actions";
import { Button } from "@/components/ui/button";

type Props = {
  variants: OpeningVariant[];
  /** When false, hide parent opening UUID (e.g. on a single-opening variants page). */
  showOpeningParentId?: boolean;
};

export function OpeningsList({
  variants,
  showOpeningParentId = true,
}: Props) {
  async function handleDelete(id: string) {
    if (!confirm("This variant will be deleted. Are you sure?")) return;
    await deleteOpeningVariantAction(id);
  }

  if (variants.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No opening variants yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {variants.map((v) => (
        <div
          key={v.id}
          className="border-border flex items-center justify-between rounded-lg border p-4"
        >
          <Link
            href={`/admin/openings/${v.id}`}
            className="hover:text-primary flex-1 transition-colors"
          >
            <p className="font-medium">
              {v.title || "Untitled Variant"}
            </p>
            {showOpeningParentId && v.openingId ? (
              <p className="text-muted-foreground text-sm">{v.openingId}</p>
            ) : (
              <p className="text-muted-foreground font-mono text-sm">
                {v.sortKey}
              </p>
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(v.id)}
            className="text-destructive hover:bg-destructive/10"
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
