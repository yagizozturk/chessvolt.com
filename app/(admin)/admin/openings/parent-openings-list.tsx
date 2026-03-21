"use client";

import Link from "next/link";
import type { Opening } from "@/features/openings/types/opening";
import { slugify } from "@/lib/utilities/slugify";
import { deleteOpeningAction } from "./opening-actions";
import { Button } from "@/components/ui/button";

type Props = {
  openings: Opening[];
};

export function ParentOpeningsList({ openings }: Props) {
  async function handleDelete(id: string) {
    if (
      !confirm(
        "This opening will be deleted. All its variants will also be deleted (CASCADE). Are you sure?",
      )
    )
      return;
    await deleteOpeningAction(id);
  }

  if (openings.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No openings yet. Add one below.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {openings.map((o) => (
        <div
          key={o.id}
          className="border-border flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex-1">
            <Link
              href={`/admin/openings/opening/${o.id}`}
              className="hover:text-primary font-medium transition-colors"
            >
              {o.name}
            </Link>
            {o.description && (
              <p className="text-muted-foreground text-sm">{o.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/openings/opening/${o.id}`}>
              <Button variant="default" size="sm">
                Variants
              </Button>
            </Link>
            <Link href={`/admin/openings/edit/${o.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Link
              href={`/openings/${o.slug ?? slugify(o.name)}/${o.id}`}
              target="_blank"
            >
              <Button variant="ghost" size="sm">
                View
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(o.id)}
              className="text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
