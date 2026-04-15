"use client";

import { deleteOpeningVariantAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import Link from "next/link";

type Props = {
  variants: OpeningVariant[];
};

export function OpeningVariantsList({ variants }: Props) {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {variants.map((v) => (
        <div
          key={v.id}
          className="border-border flex min-h-0 flex-col gap-3 rounded-lg border p-4"
        >
          <Link
            href={`/admin/openings/variants/${v.id}`}
            className="hover:text-primary line-clamp-2 block min-w-0 font-medium transition-colors"
          >
            {v.title || "Untitled Variant"}
          </Link>
          <p className="text-muted-foreground font-mono text-sm">
            {v.sortKey} · {v.group}
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDelete(v.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
